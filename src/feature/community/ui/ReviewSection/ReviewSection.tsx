import { useState } from 'react';

import styles from './ReviewSection.module.css';
import { formatCommunityDate, type CommunityReview } from '../../model';
import { useCommunityReviews } from '../../services';
import { ReviewForm } from '../ReviewForm';
import { StarRatingDisplay } from '../StarRating';

import { PseudoForm, useAccountProfile } from '@/feature/account';
import { Spinner } from '@/ui';

interface ReviewSectionProps {
  publicationId: string;
  isSubscriber: boolean;
  isMine: boolean;
  myReview: CommunityReview | null;
}

export const ReviewSection = ({
  publicationId,
  isSubscriber,
  isMine,
  myReview,
}: ReviewSectionProps) => {
  const [page, setPage] = useState(1);
  const canReadReviews = isSubscriber || isMine;
  const reviews = useCommunityReviews(publicationId, page, {
    enabled: canReadReviews,
  });
  const { data: profile, isPending: isProfilePending } = useAccountProfile();

  if (!canReadReviews) {
    return null;
  }

  const pageCount = reviews.data
    ? Math.max(1, Math.ceil(reviews.data.total / reviews.data.pageSize))
    : 1;

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <h2 id="reviews-title" className={styles.title}>
        Avis{reviews.data ? ` (${reviews.data.total})` : ''}
      </h2>

      {isMine ? (
        <p className={styles.muted}>
          Vous ne pouvez pas noter votre propre build.
        </p>
      ) : null}

      {!isMine && isSubscriber && !isProfilePending && !profile?.pseudo ? (
        <div className={styles.pseudoGate}>
          <p className={styles.muted}>
            Choisissez un pseudo pour noter et commenter les builds.
          </p>
          <PseudoForm submitLabel="Enregistrer et noter" />
        </div>
      ) : null}

      {!isMine && isSubscriber && profile?.pseudo ? (
        <ReviewForm
          key={myReview?.id ?? 'new'}
          publicationId={publicationId}
          myReview={myReview}
        />
      ) : null}

      {reviews.isPending ? <Spinner /> : null}
      {reviews.isError ? (
        <p className={styles.error} role="alert">
          {reviews.error.message}
        </p>
      ) : null}

      {reviews.data && reviews.data.items.length === 0 ? (
        <p className={styles.muted}>Aucun avis pour le moment.</p>
      ) : null}

      {reviews.data && reviews.data.items.length > 0 ? (
        <ul className={styles.list}>
          {reviews.data.items.map((review) => (
            <li key={review.id} className={styles.review}>
              <div className={styles.reviewHeader}>
                <strong>{review.reviewerPseudo}</strong>
                <StarRatingDisplay value={review.stars} />
                <span className={styles.date}>
                  {formatCommunityDate(review.updatedAt)}
                </span>
                {review.isMine ? (
                  <span className={styles.tag}>Votre avis</span>
                ) : null}
                {review.outdated ? (
                  <span
                    className={styles.outdated}
                    title="Avis donné avant la dernière mise à jour du build"
                  >
                    Version précédente
                  </span>
                ) : null}
              </div>
              {review.body ? (
                <p className={styles.body}>{review.body}</p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {pageCount > 1 ? (
        <nav className={styles.pagination} aria-label="Pages des avis">
          <button
            type="button"
            className={styles.pageButton}
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
          >
            Précédents
          </button>
          <span className={styles.muted}>
            {page} / {pageCount}
          </span>
          <button
            type="button"
            className={styles.pageButton}
            disabled={page >= pageCount}
            onClick={() => setPage((current) => current + 1)}
          >
            Suivants
          </button>
        </nav>
      ) : null}
    </section>
  );
};
