import styles from './FavoriteButton.module.css';
import { useToggleFavorite } from '../../services';

interface FavoriteButtonProps {
  publicationId: string;
  isFavorite: boolean;
  withLabel?: boolean;
}

export const FavoriteButton = ({
  publicationId,
  isFavorite,
  withLabel = false,
}: FavoriteButtonProps) => {
  const toggleFavorite = useToggleFavorite();
  const label = isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris';

  return (
    <button
      type="button"
      className={withLabel ? styles.buttonWithLabel : styles.button}
      aria-pressed={isFavorite}
      aria-label={withLabel ? undefined : label}
      title={label}
      disabled={toggleFavorite.isPending}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavorite.mutate({ id: publicationId, isFavorite: !isFavorite });
      }}
    >
      <span aria-hidden="true">{isFavorite ? '♥' : '♡'}</span>
      {withLabel ? <span>{isFavorite ? 'En favori' : 'Favori'}</span> : null}
    </button>
  );
};
