import type {
  PreviewRow,
  PublicationRow,
  ReviewRow,
  SearchParams,
  SearchRow,
  SimilarityRow,
} from './community.rules.js';
import type {
  PublishPayload,
  SimilarPayload,
  UpdatePayload,
} from './community.schema.js';

export interface GameVersionRow {
  code: string;
  label: string;
  released_at: string | null;
  is_current: boolean;
}

export interface PublicationContent {
  snapshot: unknown;
  stats: Readonly<Record<string, number>>;
}

/** Community data readable without a session. */
export interface CommunityPublicRepo {
  /** Newest first. */
  readonly gameVersions: () => Promise<ReadonlyArray<GameVersionRow>>;
  /** Preview of a publication (no content), null if unknown. */
  readonly preview: (id: string) => Promise<PreviewRow | null>;
}

/** Publications, search, favorites, recommendations of one user. */
export interface CommunityRepo {
  readonly search: (
    params: SearchParams,
  ) => Promise<{ rows: ReadonlyArray<SearchRow>; total: number }>;
  /** Returns the id of the new publication. */
  readonly publish: (
    payload: PublishPayload,
    stats: Readonly<Record<string, number>>,
  ) => Promise<string>;
  readonly update: (
    id: string,
    payload: UpdatePayload,
    stats: Readonly<Record<string, number>> | undefined,
  ) => Promise<void>;
  /** Ids actually deleted: empty when not the author (or unknown). */
  readonly unpublish: (id: string) => Promise<ReadonlyArray<string>>;
  /** Publications of the user, newest first. */
  readonly mine: () => Promise<ReadonlyArray<PublicationRow>>;
  /** Content, null when locked for the caller (RLS) or unknown. */
  readonly content: (id: string) => Promise<PublicationContent | null>;
  readonly title: (id: string) => Promise<string | null>;
  readonly header: (
    id: string,
  ) => Promise<{ author_id: string; content_updated_at: string } | null>;
  /** Fails with 23505 when already a favorite, 23503 if unknown. */
  readonly addFavorite: (id: string) => Promise<void>;
  readonly removeFavorite: (id: string) => Promise<void>;
  readonly similar: (
    payload: SimilarPayload,
    stats: Readonly<Record<string, number>>,
    limit: number,
  ) => Promise<ReadonlyArray<SimilarityRow>>;
  readonly forYou: (limit: number) => Promise<ReadonlyArray<SimilarityRow>>;
}

/** Reviews, read and written under one user's session. */
export interface ReviewRepo {
  readonly mine: (publicationId: string) => Promise<ReviewRow | null>;
  /** Most recently updated first. */
  readonly page: (
    publicationId: string,
    from: number,
    size: number,
  ) => Promise<{ rows: ReadonlyArray<ReviewRow>; total: number | null }>;
  /** Null when the user has no review on the publication yet. */
  readonly update: (
    publicationId: string,
    stars: number,
    body: string | null,
  ) => Promise<ReviewRow | null>;
  /** Fails with 23505 when a review already exists. */
  readonly insert: (
    publicationId: string,
    stars: number,
    body: string | null,
  ) => Promise<ReviewRow>;
  readonly remove: (publicationId: string) => Promise<void>;
}
