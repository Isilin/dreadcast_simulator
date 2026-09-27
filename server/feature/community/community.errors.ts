import { toInternalError, type DbError } from '../../platform/db-error.js';
import {
  BadRequest,
  Conflict,
  Forbidden,
  NotFound,
  Unauthorized,
  Unprocessable,
} from '../../platform/http-errors.js';

/**
 * Codes raised by the community RPCs (029) plus a few API-level ones. The
 * front branches on `code` and displays `error`.
 */
export const COMMUNITY_ERRORS = {
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
} as const;

export type CommunityErrorCode = keyof typeof COMMUNITY_ERRORS;

interface ErrorByStatus {
  400: BadRequest;
  401: Unauthorized;
  403: Forbidden;
  404: NotFound;
  409: Conflict;
  422: Unprocessable;
}

export type CommunityError<C extends CommunityErrorCode> =
  ErrorByStatus[(typeof COMMUNITY_ERRORS)[C]['status']];

const ERROR_CLASS_BY_STATUS = {
  400: BadRequest,
  401: Unauthorized,
  403: Forbidden,
  404: NotFound,
  409: Conflict,
  422: Unprocessable,
} as const;

/** `{ error: <message>, code }` with the status of the code. */
export const communityError = <C extends CommunityErrorCode>(
  code: C,
): CommunityError<C> => {
  const { status, message } = COMMUNITY_ERRORS[code];
  const ErrorClass = ERROR_CLASS_BY_STATUS[status];
  return new ErrorClass({ error: message, code }) as CommunityError<C>;
};

export const isCommunityErrorCode = (
  value: string,
): value is CommunityErrorCode => Object.hasOwn(COMMUNITY_ERRORS, value);

/**
 * Failure of a community RPC or query: the RPCs raise the error codes as
 * messages; row level security refusals become FORBIDDEN.
 */
export const toCommunityError = (error: DbError) => {
  if (isCommunityErrorCode(error.message)) {
    return communityError(error.message);
  }
  if (error.code === '42501') {
    return communityError('FORBIDDEN');
  }
  return toInternalError(error);
};
