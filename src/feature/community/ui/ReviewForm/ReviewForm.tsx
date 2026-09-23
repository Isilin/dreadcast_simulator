import { useId, useState, type FormEvent } from 'react';

import styles from './ReviewForm.module.css';
import { REVIEW_BODY_MAX_LENGTH, type CommunityReview } from '../../model';
import { useDeleteReview, useSaveReview } from '../../services';
import { StarRatingInput } from '../StarRating';

interface ReviewFormProps {
  publicationId: string;
  myReview: CommunityReview | null;
}

export const ReviewForm = ({ publicationId, myReview }: ReviewFormProps) => {
  const bodyId = useId();
  const [stars, setStars] = useState(myReview?.stars ?? 0);
  const [body, setBody] = useState(myReview?.body ?? '');
  const [validationError, setValidationError] = useState<string | null>(null);
  const saveReview = useSaveReview(publicationId);
  const deleteReview = useDeleteReview(publicationId);
  const isBusy = saveReview.isPending || deleteReview.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (stars < 1) {
      setValidationError('Choisissez une note de 1 à 5 étoiles.');
      return;
    }

    setValidationError(null);
    saveReview.mutate({ stars, body: body.trim() || null });
  };

  const handleDelete = () => {
    deleteReview.mutate(undefined, {
      onSuccess: () => {
        setStars(0);
        setBody('');
      },
    });
  };

  const error =
    validationError ??
    (saveReview.isError ? saveReview.error.message : null) ??
    (deleteReview.isError ? deleteReview.error.message : null);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <p className={styles.title}>
        {myReview ? 'Votre avis' : 'Noter ce build'}
      </p>
      <StarRatingInput
        value={stars}
        onChange={(value) => {
          setStars(value);
          setValidationError(null);
        }}
        disabled={isBusy}
      />
      <label htmlFor={bodyId} className={styles.label}>
        Avis (facultatif)
      </label>
      <textarea
        id={bodyId}
        className={styles.textarea}
        value={body}
        maxLength={REVIEW_BODY_MAX_LENGTH}
        placeholder="Points forts, usage conseillé…"
        onChange={(event) => setBody(event.target.value)}
      />
      <p className={styles.counter}>
        {body.length} / {REVIEW_BODY_MAX_LENGTH}
      </p>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      {saveReview.isSuccess && !isBusy ? (
        <p className={styles.success} role="status">
          Avis enregistré.
        </p>
      ) : null}
      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isBusy}>
          {saveReview.isPending
            ? 'Enregistrement…'
            : myReview
              ? 'Modifier mon avis'
              : 'Publier mon avis'}
        </button>
        {myReview ? (
          <button
            type="button"
            className={styles.delete}
            onClick={handleDelete}
            disabled={isBusy}
          >
            Supprimer
          </button>
        ) : null}
      </div>
    </form>
  );
};
