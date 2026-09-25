import type { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

import {
  callCommunitySearch,
  fetchBuildSlots,
  fetchPseudo,
  searchQueryToParams,
  sendCommunityError,
  sendDbError,
  toSummaryDto,
  type CommunityPreviewRow,
} from './community.api.js';
import type {
  CommunityBuildDetailDto,
  CommunityMetaResponseDto,
  CommunityRecommendationsResponseDto,
  CommunityReviewDto,
  CommunityReviewsResponseDto,
  CommunitySearchResponseDto,
  CommunityStatsDto,
  CopyCommunityBuildResponseDto,
  GameVersionDto,
  MyPublicationDto,
  PublishCommunityBuildResponseDto,
  SpecializationCode,
} from './community.types.js';
import {
  hasAdvancedFilters,
  publishPayloadSchema,
  reviewPayloadSchema,
  searchQuerySchema,
  similarPayloadSchema,
  TITLE_MAX_LENGTH,
  updatePayloadSchema,
} from './community.validation.js';
import {
  doCreateClient,
  requireAuthenticatedUser,
  sendJson,
  setNoStoreHeaders,
  type AuthenticatedContext,
} from './helper.api.js';
import { fetchHasActiveSubscription } from './subscription.api.js';

const idSchema = z.uuid();
const REVIEWS_PAGE_SIZE = 20;
const RECOMMENDATIONS_LIMIT = 12;

interface CommunityRoute {
  resource?: string;
  id?: string;
  action?: string;
}

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

/** Vercel gives string | string[] per key; filters use one value each. */
const normalizeQuery = (query: VercelRequest['query']) =>
  Object.fromEntries(
    Object.entries(query).map(([key, value]) => [key, firstValue(value)]),
  );

/** Maps the first failing field of a payload to a stable error code. */
const payloadErrorCode = (error: z.ZodError): string => {
  const field = error.issues[0]?.path[0];
  switch (field) {
    case 'title':
      return 'INVALID_TITLE';
    case 'description':
      return 'INVALID_DESCRIPTION';
    case 'specialization':
    case 'detected_specialization':
      return 'INVALID_SPECIALIZATION';
    case 'stats':
      return 'INVALID_STATS';
    default:
      return 'INVALID_PAYLOAD';
  }
};

const sendOk = (res: VercelResponse, status: number, payload: unknown) => {
  setNoStoreHeaders(res);
  return res.status(status).json(payload);
};

const requireSubscription = async (
  context: AuthenticatedContext,
  res: VercelResponse,
): Promise<boolean> => {
  const subscription = await fetchHasActiveSubscription(
    context.supabase,
    context.userId,
  );

  if (subscription.error) {
    res.status(500).json({ error: subscription.error.message });
    return false;
  }

  if (!subscription.isActive) {
    sendCommunityError(res, 'SUBSCRIPTION_REQUIRED');
    return false;
  }

  return true;
};

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const handleMeta = async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { data, error } = await doCreateClient()
    .from('game_version')
    .select('code, label, released_at, is_current')
    .order('created_at', { ascending: false });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const versions = (data ?? []) as GameVersionDto[];
  const payload: CommunityMetaResponseDto = {
    current_version:
      versions.find((version) => version.is_current)?.code ?? null,
    versions,
  };

  return sendJson(res, payload);
};

// ---------------------------------------------------------------------------
// Builds collection
// ---------------------------------------------------------------------------

const handleSearch = async (
  context: AuthenticatedContext,
  req: VercelRequest,
  res: VercelResponse,
) => {
  const parsedQuery = searchQuerySchema.safeParse(normalizeQuery(req.query));
  if (!parsedQuery.success) {
    return sendCommunityError(res, 'INVALID_FILTERS');
  }

  const query = parsedQuery.data;
  if (hasAdvancedFilters(query) && !(await requireSubscription(context, res))) {
    return;
  }

  const { rows, total, error } = await callCommunitySearch(
    context.supabase,
    searchQueryToParams(query),
  );

  if (error) {
    return sendDbError(res, error);
  }

  const payload: CommunitySearchResponseDto = {
    items: rows.map(toSummaryDto),
    total,
    page: query.page,
    page_size: query.pageSize,
  };

  return sendOk(res, 200, payload);
};

const handlePublish = async (
  context: AuthenticatedContext,
  req: VercelRequest,
  res: VercelResponse,
) => {
  const parsedPayload = publishPayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return sendCommunityError(res, payloadErrorCode(parsedPayload.error));
  }

  const payload = parsedPayload.data;
  const { data, error } = await context.supabase.rpc('community_publish', {
    p_slot: payload.slot,
    p_title: payload.title,
    p_description: payload.description,
    p_specialization: payload.specialization,
    p_detected_specialization: payload.detected_specialization,
    p_stats: payload.stats,
  });

  if (error) {
    return sendDbError(res, error);
  }

  const response: PublishCommunityBuildResponseDto = { id: data as string };
  return sendOk(res, 201, response);
};

const handleMine = async (
  context: AuthenticatedContext,
  res: VercelResponse,
) => {
  const { supabase, userId } = context;

  const [publications, buildSlots, subscription] = await Promise.all([
    supabase
      .from('community_build')
      .select(
        'id, title, description, specialization, source_build_id, game_version, rating_count, rating_avg, published_at, content_updated_at',
      )
      .eq('author_id', userId)
      .order('published_at', { ascending: false }),
    fetchBuildSlots(supabase, userId),
    fetchHasActiveSubscription(supabase, userId),
  ]);

  const error = publications.error ?? buildSlots.error ?? subscription.error;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const rows = (publications.data ?? []) as Array<{
    id: string;
    title: string;
    description: string | null;
    specialization: SpecializationCode;
    source_build_id: string | null;
    game_version: string;
    rating_count: number;
    rating_avg: number | string | null;
    published_at: string;
    content_updated_at: string;
  }>;

  const payload: MyPublicationDto[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    specialization: row.specialization,
    source_slot: row.source_build_id
      ? (buildSlots.slots.get(row.source_build_id) ?? null)
      : null,
    game_version: row.game_version,
    rating_count: row.rating_count,
    rating_avg: row.rating_avg === null ? null : Number(row.rating_avg),
    published_at: row.published_at,
    content_updated_at: row.content_updated_at,
    frozen: !subscription.isActive,
  }));

  return sendOk(res, 200, payload);
};

// ---------------------------------------------------------------------------
// Single build
// ---------------------------------------------------------------------------

interface ReviewRow {
  id: string;
  reviewer_id: string;
  stars: number;
  body: string | null;
  created_at: string;
  updated_at: string;
}

const REVIEW_SELECT = 'id, reviewer_id, stars, body, created_at, updated_at';

const toReviewDto = (
  row: ReviewRow,
  pseudo: string,
  userId: string,
  contentUpdatedAt: string,
): CommunityReviewDto => ({
  id: row.id,
  stars: row.stars,
  body: row.body,
  created_at: row.created_at,
  updated_at: row.updated_at,
  reviewer_pseudo: pseudo,
  is_mine: row.reviewer_id === userId,
  outdated: new Date(row.updated_at) < new Date(contentUpdatedAt),
});

const handleDetail = async (
  context: AuthenticatedContext,
  id: string,
  res: VercelResponse,
) => {
  const { supabase, userId } = context;

  const [search, content, subscription, myReview, pseudo] = await Promise.all([
    callCommunitySearch(supabase, {
      ids: [id],
      gameVersion: '*',
      limit: 1,
      offset: 0,
    }),
    supabase
      .from('community_build_content')
      .select('snapshot, stats')
      .eq('publication_id', id)
      .maybeSingle(),
    fetchHasActiveSubscription(supabase, userId),
    supabase
      .from('community_review')
      .select(REVIEW_SELECT)
      .eq('publication_id', id)
      .eq('reviewer_id', userId)
      .maybeSingle(),
    fetchPseudo(supabase, userId),
  ]);

  if (search.error) {
    return sendDbError(res, search.error);
  }

  const error =
    content.error ?? subscription.error ?? myReview.error ?? pseudo.error;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const row = search.rows[0];
  if (!row) {
    return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
  }

  const contentRow = content.data as {
    snapshot: unknown;
    stats: CommunityStatsDto;
  } | null;
  const reviewRow = myReview.data as ReviewRow | null;

  const payload: CommunityBuildDetailDto = {
    summary: toSummaryDto(row),
    content: contentRow
      ? {
          snapshot:
            typeof contentRow.snapshot === 'string'
              ? JSON.parse(contentRow.snapshot)
              : contentRow.snapshot,
          stats: contentRow.stats,
        }
      : null,
    locked: !contentRow,
    is_subscriber: subscription.isActive,
    my_review: reviewRow
      ? toReviewDto(
          reviewRow,
          pseudo.pseudo ?? '',
          userId,
          row.content_updated_at,
        )
      : null,
  };

  return sendOk(res, 200, payload);
};

/**
 * GET /api/community/builds/:id without a session: a shared link opens the
 * locked preview, as for a signed-in non-subscriber.
 */
const handleGuestDetail = async (id: string, res: VercelResponse) => {
  if (!idSchema.safeParse(id).success) {
    return sendCommunityError(res, 'INVALID_ID');
  }

  const { data, error } = await doCreateClient()
    .rpc('community_get_preview', { p_id: id })
    .maybeSingle();

  if (error) {
    return sendDbError(res, error);
  }

  if (!data) {
    return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
  }

  const payload: CommunityBuildDetailDto = {
    summary: toSummaryDto({
      ...(data as CommunityPreviewRow),
      stats: null,
      is_mine: false,
      is_favorite: false,
    }),
    content: null,
    locked: true,
    is_subscriber: false,
    my_review: null,
  };

  return sendOk(res, 200, payload);
};

const handleUpdate = async (
  context: AuthenticatedContext,
  id: string,
  req: VercelRequest,
  res: VercelResponse,
) => {
  const parsedPayload = updatePayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return sendCommunityError(res, payloadErrorCode(parsedPayload.error));
  }

  const payload = parsedPayload.data;
  const { error } = await context.supabase.rpc('community_update_publication', {
    p_id: id,
    p_title: payload.title,
    p_description: payload.description,
    p_specialization: payload.specialization,
    p_refresh: payload.refresh,
    p_detected_specialization: payload.detected_specialization ?? null,
    p_stats: payload.stats ?? null,
  });

  if (error) {
    return sendDbError(res, error);
  }

  return sendOk(res, 200, { id });
};

const handleUnpublish = async (
  context: AuthenticatedContext,
  id: string,
  res: VercelResponse,
) => {
  const { data, error } = await context.supabase
    .from('community_build')
    .delete()
    .eq('id', id)
    .eq('author_id', context.userId)
    .select('id');

  if (error) {
    return sendDbError(res, error);
  }

  if (!data || data.length === 0) {
    return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
  }

  return sendOk(res, 200, { id });
};

const COPY_SUFFIX = ' (copie)';

const handleCopy = async (
  context: AuthenticatedContext,
  id: string,
  res: VercelResponse,
) => {
  if (!(await requireSubscription(context, res))) {
    return;
  }

  const { supabase, userId } = context;
  const [publication, content] = await Promise.all([
    supabase.from('community_build').select('title').eq('id', id).maybeSingle(),
    supabase
      .from('community_build_content')
      .select('snapshot')
      .eq('publication_id', id)
      .maybeSingle(),
  ]);

  const error = publication.error ?? content.error;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!publication.data || !content.data) {
    return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
  }

  const rawSnapshot = (content.data as { snapshot: unknown }).snapshot;
  const snapshot = (
    typeof rawSnapshot === 'string' ? JSON.parse(rawSnapshot) : rawSnapshot
  ) as Record<string, unknown>;
  const title = (publication.data as { title: string }).title;
  const name = `${title.slice(0, TITLE_MAX_LENGTH - COPY_SUFFIX.length)}${COPY_SUFFIX}`;
  const savedAt = new Date();

  const { data: inserted, error: insertError } = await supabase
    .from('build')
    .insert({
      user_id: userId,
      snapshot: { ...snapshot, name, savedAt: savedAt.getTime() },
      saved_at: savedAt.toISOString(),
    })
    .select('id')
    .single();

  if (insertError) {
    return sendDbError(res, insertError);
  }

  const { slots, error: slotsError } = await fetchBuildSlots(supabase, userId);
  if (slotsError) {
    return res.status(500).json({ error: slotsError.message });
  }

  const payload: CopyCommunityBuildResponseDto = {
    slot: slots.get((inserted as { id: string }).id) ?? slots.size,
  };
  return sendOk(res, 201, payload);
};

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------

const fetchPublicationHeader = async (
  context: AuthenticatedContext,
  id: string,
) => {
  const { data, error } = await context.supabase
    .from('community_build')
    .select('author_id, content_updated_at')
    .eq('id', id)
    .maybeSingle();

  return {
    publication: data as {
      author_id: string;
      content_updated_at: string;
    } | null,
    error,
  };
};

const handleReviews = async (
  context: AuthenticatedContext,
  id: string,
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { supabase, userId } = context;
  const page = Math.max(1, Number(firstValue(req.query.page)) || 1);

  const [header, subscription] = await Promise.all([
    fetchPublicationHeader(context, id),
    fetchHasActiveSubscription(supabase, userId),
  ]);

  const error = header.error ?? subscription.error;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!header.publication) {
    return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
  }

  if (!subscription.isActive && header.publication.author_id !== userId) {
    return sendCommunityError(res, 'SUBSCRIPTION_REQUIRED');
  }

  const from = (page - 1) * REVIEWS_PAGE_SIZE;
  const {
    data,
    error: reviewsError,
    count,
  } = await supabase
    .from('community_review')
    .select(REVIEW_SELECT, { count: 'exact' })
    .eq('publication_id', id)
    .order('updated_at', { ascending: false })
    .order('id', { ascending: true })
    .range(from, from + REVIEWS_PAGE_SIZE - 1);

  if (reviewsError) {
    return res.status(500).json({ error: reviewsError.message });
  }

  const rows = (data ?? []) as ReviewRow[];
  const reviewerIds = [...new Set(rows.map((row) => row.reviewer_id))];
  const pseudos = new Map<string, string>();

  if (reviewerIds.length > 0) {
    const { data: profiles, error: profilesError } = await supabase
      .from('user_profile')
      .select('user_id, pseudo')
      .in('user_id', reviewerIds);

    if (profilesError) {
      return res.status(500).json({ error: profilesError.message });
    }

    ((profiles ?? []) as Array<{ user_id: string; pseudo: string }>).forEach(
      (profile) => pseudos.set(profile.user_id, profile.pseudo),
    );
  }

  const payload: CommunityReviewsResponseDto = {
    items: rows.map((row) =>
      toReviewDto(
        row,
        pseudos.get(row.reviewer_id) ?? 'Anonyme',
        userId,
        header.publication!.content_updated_at,
      ),
    ),
    total: count ?? rows.length,
    page,
    page_size: REVIEWS_PAGE_SIZE,
  };

  return sendOk(res, 200, payload);
};

const handleMyReview = async (
  context: AuthenticatedContext,
  id: string,
  req: VercelRequest,
  res: VercelResponse,
) => {
  const { supabase, userId } = context;

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('community_review')
      .delete()
      .eq('publication_id', id)
      .eq('reviewer_id', userId);

    if (error) {
      return sendDbError(res, error);
    }

    return sendOk(res, 200, { deleted: true });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const parsedPayload = reviewPayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return sendCommunityError(res, 'INVALID_REVIEW');
  }

  const [header, subscription, pseudo] = await Promise.all([
    fetchPublicationHeader(context, id),
    fetchHasActiveSubscription(supabase, userId),
    fetchPseudo(supabase, userId),
  ]);

  const error = header.error ?? subscription.error ?? pseudo.error;
  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!header.publication) {
    return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
  }

  if (header.publication.author_id === userId) {
    return sendCommunityError(res, 'SELF_REVIEW');
  }

  if (!subscription.isActive) {
    return sendCommunityError(res, 'SUBSCRIPTION_REQUIRED');
  }

  if (!pseudo.pseudo) {
    return sendCommunityError(res, 'PSEUDO_REQUIRED');
  }

  const { stars, body } = parsedPayload.data;

  // Select then update/insert: a PostgREST upsert would need UPDATE on every
  // column, but only (stars, body) are updatable.
  const updateExisting = () =>
    supabase
      .from('community_review')
      .update({ stars, body })
      .eq('publication_id', id)
      .eq('reviewer_id', userId)
      .select(REVIEW_SELECT)
      .maybeSingle();

  let result = await updateExisting();
  if (!result.error && !result.data) {
    result = await supabase
      .from('community_review')
      .insert({ publication_id: id, reviewer_id: userId, stars, body })
      .select(REVIEW_SELECT)
      .single();

    // Concurrent first review from another tab: fall back to an update.
    if (result.error?.code === '23505') {
      result = await updateExisting();
    }
  }

  if (result.error) {
    return sendDbError(res, result.error);
  }

  if (!result.data) {
    return sendCommunityError(res, 'FORBIDDEN');
  }

  return sendOk(
    res,
    200,
    toReviewDto(
      result.data as ReviewRow,
      pseudo.pseudo,
      userId,
      header.publication.content_updated_at,
    ),
  );
};

// ---------------------------------------------------------------------------
// Favorites
// ---------------------------------------------------------------------------

const handleFavorite = async (
  context: AuthenticatedContext,
  id: string,
  req: VercelRequest,
  res: VercelResponse,
) => {
  const { supabase, userId } = context;

  if (req.method === 'DELETE') {
    const { error } = await supabase
      .from('community_favorite')
      .delete()
      .eq('publication_id', id)
      .eq('user_id', userId);

    if (error) {
      return sendDbError(res, error);
    }

    return sendOk(res, 200, { is_favorite: false });
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireSubscription(context, res))) {
    return;
  }

  const { error } = await supabase
    .from('community_favorite')
    .insert({ publication_id: id, user_id: userId });

  if (error && error.code !== '23505') {
    if (error.code === '23503') {
      return sendCommunityError(res, 'PUBLICATION_NOT_FOUND');
    }
    return sendDbError(res, error);
  }

  return sendOk(res, 200, { is_favorite: true });
};

// ---------------------------------------------------------------------------
// Recommendations
// ---------------------------------------------------------------------------

interface SimilarityRow {
  publication_id: string;
  similarity: number;
}

const hydrateRecommendations = async (
  context: AuthenticatedContext,
  similarities: SimilarityRow[],
) => {
  if (similarities.length === 0) {
    return { items: [], error: null };
  }

  const { rows, error } = await callCommunitySearch(context.supabase, {
    ids: similarities.map((row) => row.publication_id),
    gameVersion: '*',
    limit: similarities.length,
    offset: 0,
  });

  const summaries = new Map(rows.map((row) => [row.id, toSummaryDto(row)]));
  const items = similarities.flatMap((row) => {
    const summary = summaries.get(row.publication_id);
    return summary ? [{ ...summary, similarity: row.similarity }] : [];
  });

  return { items, error };
};

const handleSimilar = async (
  context: AuthenticatedContext,
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireSubscription(context, res))) {
    return;
  }

  const parsedPayload = similarPayloadSchema.safeParse(req.body);
  if (!parsedPayload.success) {
    return sendCommunityError(res, payloadErrorCode(parsedPayload.error));
  }

  const payload = parsedPayload.data;
  const { data, error } = await context.supabase.rpc('community_similar', {
    p_stats: payload.stats,
    p_exclude_ids: payload.exclude_ids ?? null,
    p_game_version: payload.version ?? null,
    p_limit: payload.limit ?? RECOMMENDATIONS_LIMIT,
  });

  if (error) {
    return sendDbError(res, error);
  }

  const hydrated = await hydrateRecommendations(
    context,
    (data ?? []) as SimilarityRow[],
  );

  if (hydrated.error) {
    return sendDbError(res, hydrated.error);
  }

  const response: CommunityRecommendationsResponseDto = {
    items: hydrated.items,
    strategy: 'similar',
  };
  return sendOk(res, 200, response);
};

const handleForYou = async (
  context: AuthenticatedContext,
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!(await requireSubscription(context, res))) {
    return;
  }

  const { data, error } = await context.supabase.rpc('community_for_you', {
    p_limit: RECOMMENDATIONS_LIMIT,
  });

  if (error) {
    return sendDbError(res, error);
  }

  const similarities = (data ?? []) as SimilarityRow[];
  if (similarities.length > 0) {
    const hydrated = await hydrateRecommendations(context, similarities);
    if (hydrated.error) {
      return sendDbError(res, hydrated.error);
    }

    const response: CommunityRecommendationsResponseDto = {
      items: hydrated.items,
      strategy: 'similar',
    };
    return sendOk(res, 200, response);
  }

  // No signal yet (no publication, favorite or 4+ star review): trending.
  const trending = await callCommunitySearch(context.supabase, {
    sort: 'trending',
    limit: RECOMMENDATIONS_LIMIT + 6,
    offset: 0,
  });

  if (trending.error) {
    return sendDbError(res, trending.error);
  }

  const response: CommunityRecommendationsResponseDto = {
    items: trending.rows
      .filter((row) => !row.is_mine)
      .slice(0, RECOMMENDATIONS_LIMIT)
      .map((row) => ({ ...toSummaryDto(row), similarity: null })),
    strategy: 'trending',
  };
  return sendOk(res, 200, response);
};

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const handleBuild = async (
  context: AuthenticatedContext,
  id: string,
  action: string | undefined,
  req: VercelRequest,
  res: VercelResponse,
) => {
  if (!idSchema.safeParse(id).success) {
    return sendCommunityError(res, 'INVALID_ID');
  }

  switch (action) {
    case undefined:
      if (req.method === 'GET') return handleDetail(context, id, res);
      if (req.method === 'PUT') return handleUpdate(context, id, req, res);
      if (req.method === 'DELETE') return handleUnpublish(context, id, res);
      return res.status(405).json({ error: 'Method not allowed' });
    case 'copy':
      if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      return handleCopy(context, id, res);
    case 'reviews':
      return handleReviews(context, id, req, res);
    case 'review':
      return handleMyReview(context, id, req, res);
    case 'favorite':
      return handleFavorite(context, id, req, res);
    default:
      return sendCommunityError(res, 'NOT_FOUND');
  }
};

/**
 * Entry point of api/community (see the rewrites in vercel.json).
 */
export const routeCommunityRequest = async (
  req: VercelRequest,
  res: VercelResponse,
  route: CommunityRoute,
) => {
  if (route.resource === 'meta') {
    return handleMeta(req, res);
  }

  if (
    route.resource === 'builds' &&
    route.id &&
    !route.action &&
    req.method === 'GET' &&
    !req.headers.authorization
  ) {
    return handleGuestDetail(route.id, res);
  }

  const context = await requireAuthenticatedUser(req, res);
  if (!context) {
    return;
  }

  switch (route.resource) {
    case 'builds':
      if (route.id) {
        return handleBuild(context, route.id, route.action, req, res);
      }
      if (req.method === 'GET') return handleSearch(context, req, res);
      if (req.method === 'POST') return handlePublish(context, req, res);
      return res.status(405).json({ error: 'Method not allowed' });
    case 'me':
      if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
      }
      return handleMine(context, res);
    case 'similar':
      return handleSimilar(context, req, res);
    case 'for-you':
      return handleForYou(context, req, res);
    default:
      return sendCommunityError(res, 'NOT_FOUND');
  }
};
