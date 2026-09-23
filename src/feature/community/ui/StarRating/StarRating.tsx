import { useState } from 'react';

import styles from './StarRating.module.css';

const STARS = [1, 2, 3, 4, 5] as const;

const averageFormatter = new Intl.NumberFormat('fr-FR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

interface StarRatingDisplayProps {
  value: number | null;
  count?: number;
}

/**
 * Read-only average rating, e.g. "★★★★☆ 4,2 (12)".
 */
export const StarRatingDisplay = ({ value, count }: StarRatingDisplayProps) => {
  const label =
    value === null
      ? 'Pas encore noté'
      : `Note moyenne ${averageFormatter.format(value)} sur 5${
          count !== undefined ? `, ${count} avis` : ''
        }`;

  return (
    <span className={styles.display} aria-label={label} title={label}>
      <span className={styles.stars} aria-hidden="true">
        {STARS.map((star) => (
          <span
            key={star}
            className={
              value !== null && value >= star - 0.25
                ? styles.starOn
                : styles.starOff
            }
          >
            ★
          </span>
        ))}
      </span>
      <span className={styles.value} aria-hidden="true">
        {value === null ? '—' : averageFormatter.format(value)}
        {count !== undefined ? ` (${count})` : ''}
      </span>
    </span>
  );
};

interface StarRatingInputProps {
  value: number;
  onChange: (stars: number) => void;
  disabled?: boolean;
}

/**
 * 1 to 5 star picker, keyboard accessible as a radio group.
 */
export const StarRatingInput = ({
  value,
  onChange,
  disabled = false,
}: StarRatingInputProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const shown = hovered ?? value;

  return (
    <div
      className={styles.input}
      role="radiogroup"
      aria-label="Note"
      onMouseLeave={() => setHovered(null)}
    >
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} étoile${star > 1 ? 's' : ''}`}
          className={star <= shown ? styles.inputStarOn : styles.inputStar}
          disabled={disabled}
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
};
