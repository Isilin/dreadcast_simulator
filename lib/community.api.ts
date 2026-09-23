import type { VercelResponse } from '@vercel/node';

import type {
  CommunityBuildSummaryDto,
  CommunityKeyStatDto,
  CommunityStatsDto,
  SpecializationCode,
} from './community.types.js';
import type { SearchQuery } from './community.validation.js';
import type { AuthenticatedSupabaseClient } from './helper.api.js';

interface CommunityErrorDefinition {
  status: number;
  message: string;
}

/**
 * Codes raised by the community RPCs (029) plus a few API-level ones.
 */
const COMMUNITY_ERRORS: Record<string, CommunityErrorDefinition> = {
  NOT_AUTHENTICATED: { status: 401, message: 'Utilisateur non authentifie.' },
  SUBSCRIPTION_REQUIRED: { status: 403, message: 'Abonnement valide requis.' },
  PSEUDO_REQUIRED: {
    status: 403,
    message: 'Choisissez un pseudo avant de publier ou de noter.',
  },
  FROZEN: {
    status: 403,
    message:
      'Abonnement expire : la publication est figee. Vous pouvez toujours la depublier.',
  },
  SELF_REVIEW: {
    status: 403,
    message: 'Vous ne pouvez pas noter votre propre build.',
  },
  FORBIDDEN: { status: 403, message: 'Action non autorisee.' },
  BUILD_NOT_FOUND: { status: 404, message: 'Build introuvable pour ce slot.' },
  PUBLICATION_NOT_FOUND: { status: 404, message: 'Publication introuvable.' },
  SOURCE_BUILD_MISSING: {
    status: 409,
    message: 'Le build source a ete supprime : mise a jour impossible.',
  },
  ALREADY_PUBLISHED: { status: 409, message: 'Ce build est deja publie.' },
  PSEUDO_TAKEN: { status: 409, message: 'Ce pseudo est deja utilise.' },
  PSEUDO_ALREADY_SET: {
    status: 409,
    message: 'Le pseudo est definitif et deja choisi.',
  },
  INVALID_TITLE: {
    status: 422,
    message: 'Le titre doit contenir entre 3 et 64 caracteres.',
  },
  INVALID_DESCRIPTION: {
    status: 422,
    message: 'La description ne doit pas depasser 1000 caracteres.',
  },
  INVALID_SPECIALIZATION: { status: 422, message: 'Specialisation invalide.' },
  INVALID_STATS: { status: 422, message: 'Statistiques invalides.' },
  INVALID_SNAPSHOT: {
    status: 422,
    message: 'Le build contient des donnees invalides.',
  },
  INVALID_PSEUDO: {
    status: 422,
    message:
      'Pseudo invalide : 3 a 24 caracteres (lettres, chiffres, _ . -), noms reserves interdits.',
  },
  INVALID_REVIEW: {
    status: 422,
    message:
      "La note doit etre comprise entre 1 et 5 etoiles et l'avis faire au plus 280 caracteres.",
  },
  INVALID_FILTERS: { status: 400, message: 'Filtres de recherche invalides.' },
  INVALID_ID: { status: 400, message: 'Identifiant de publication invalide.' },
  INVALID_PAYLOAD: { status: 400, message: 'Requete invalide.' },
  NOT_FOUND: { status: 404, message: 'Ressource introuvable.' },
};

export const sendCommunityError = (
  res: VercelResponse,
  code: keyof typeof COMMUNITY_ERRORS | string,
) => {
  const definition = COMMUNITY_ERRORS[code] ?? {
    status: 500,
    message: 'Erreur Communaute.',
  };
  return res
    .status(definition.status)
    .json({ error: definition.message, code });
};

interface PostgrestLikeError {
  code?: string;
  message: string;
}

/**
 * Maps a Supabase error (RPC exception, RLS, constraint) to an API response.
 */
export const sendDbError = (res: VercelResponse, error: PostgrestLikeError) => {
  if (COMMUNITY_ERRORS[error.message]) {
    return sendCommunityError(res, error.message);
  }

  if (error.code === '42501') {
    return sendCommunityError(res, 'FORBIDDEN');
  }

  return res.status(500).json({ error: error.message });
};

export interface CommunitySearchRow {
  id: string;
  title: string;
  description: string | null;
  specialization: SpecializationCode;
  detected_specialization: SpecializationCode;
  game_version: string;
  race: string;
  gender: 'male' | 'female';
  weapon_types: string[] | null;
  has_heal_weapon: boolean;
  key_stats: CommunityKeyStatDto[] | null;
  rating_count: number;
  rating_avg: number | string | null;
  published_at: string;
  content_updated_at: string;
  author_id: string;
  author_pseudo: string;
  stats: CommunityStatsDto | null;
  is_mine: boolean;
  is_favorite: boolean;
  bayes_score: number | string;
  trend_score: number;
  total_count: number | string;
}

const toNumberOrNull = (value: number | string | null): number | null =>
  value === null ? null : Number(value);

export const toSummaryDto = (
  row: CommunitySearchRow,
): CommunityBuildSummaryDto => ({
  id: row.id,
  title: row.title,
  description: row.description,
  specialization: row.specialization,
  detected_specialization: row.detected_specialization,
  game_version: row.game_version,
  race: row.race,
  gender: row.gender,
  weapon_types: row.weapon_types ?? [],
  has_heal_weapon: row.has_heal_weapon,
  key_stats: (row.key_stats ?? []).map((entry) => ({
    stat: entry.stat,
    value: Number(entry.value),
  })),
  rating_count: row.rating_count,
  rating_avg: toNumberOrNull(row.rating_avg),
  published_at: row.published_at,
  content_updated_at: row.content_updated_at,
  author_pseudo: row.author_pseudo,
  stats: row.stats,
  is_mine: row.is_mine,
  is_favorite: row.is_favorite,
});

export interface CommunitySearchParams {
  query?: string;
  specializations?: string[];
  minRating?: number;
  races?: string[];
  genders?: string[];
  weaponTypes?: string[];
  healOnly?: boolean;
  /** undefined = current version, '*' = all versions. */
  gameVersion?: string;
  statMin?: Record<string, number>;
  implants?: string[];
  drugIds?: string[];
  itemIds?: string[];
  favoritesOnly?: boolean;
  ids?: string[];
  sort?: string;
  limit: number;
  offset: number;
}

const emptyToNull = <T>(values: T[] | undefined): T[] | null =>
  values && values.length > 0 ? values : null;

export const searchQueryToParams = (
  query: SearchQuery,
): CommunitySearchParams => ({
  query: query.q,
  specializations: query.spec,
  minRating: query.minRating,
  races: query.race,
  genders: query.gender,
  weaponTypes: query.weapon,
  healOnly: query.heal,
  gameVersion: query.version,
  statMin: query.minStats,
  implants: query.implants,
  drugIds: query.drugs,
  itemIds: query.items,
  favoritesOnly: query.favorites,
  sort: query.sort,
  limit: query.pageSize,
  offset: (query.page - 1) * query.pageSize,
});

export const callCommunitySearch = async (
  supabase: AuthenticatedSupabaseClient,
  params: CommunitySearchParams,
) => {
  const { data, error } = await supabase.rpc('community_search', {
    p_query: params.query ?? null,
    p_specializations: emptyToNull(params.specializations),
    p_min_rating: params.minRating ?? null,
    p_races: emptyToNull(params.races),
    p_genders: emptyToNull(params.genders),
    p_weapon_types: emptyToNull(params.weaponTypes),
    p_heal_only: params.healOnly ?? false,
    p_game_version: params.gameVersion ?? null,
    p_stat_min:
      params.statMin && Object.keys(params.statMin).length > 0
        ? params.statMin
        : null,
    p_implants: emptyToNull(params.implants),
    p_drug_ids: emptyToNull(params.drugIds),
    p_item_ids: emptyToNull(params.itemIds),
    p_author_id: null,
    p_favorites_only: params.favoritesOnly ?? false,
    p_ids: emptyToNull(params.ids),
    p_sort: params.sort ?? 'trending',
    p_limit: params.limit,
    p_offset: params.offset,
  });

  const rows = (data ?? []) as CommunitySearchRow[];
  return {
    rows,
    total: rows.length > 0 ? Number(rows[0].total_count) : 0,
    error,
  };
};

/**
 * Current 1-based slot of each of the user's builds (same order as
 * api/builds: created_at, id).
 */
export const fetchBuildSlots = async (
  supabase: AuthenticatedSupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabase
    .from('build')
    .select('id')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .order('id', { ascending: true });

  const slots = new Map<string, number>();
  ((data ?? []) as Array<{ id: string }>).forEach((row, index) => {
    slots.set(row.id, index + 1);
  });

  return { slots, error };
};

export const fetchPseudo = async (
  supabase: AuthenticatedSupabaseClient,
  userId: string,
) => {
  const { data, error } = await supabase
    .from('user_profile')
    .select('pseudo')
    .eq('user_id', userId)
    .maybeSingle();

  return {
    pseudo: (data as { pseudo: string } | null)?.pseudo ?? null,
    error,
  };
};
