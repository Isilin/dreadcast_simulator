import { Link } from '@tanstack/react-router';

import styles from './CommunityBuildCard.module.css';
import {
  describeWeapons,
  formatCommunityDate,
  formatStatValue,
  GENDER_LABELS,
  wasUpdatedAfterPublication,
  type CommunityBuildSummary,
} from '../../model';
import { SpecializationBadge, VersionBadge } from '../Badges';
import { FavoriteButton } from '../FavoriteButton';
import { StarRatingDisplay } from '../StarRating';

import { StatValues } from '@/domain';
import Routes from '@/utils/routes';

interface CommunityBuildCardProps {
  build: CommunityBuildSummary;
  currentVersion: string | null | undefined;
  canFavorite: boolean;
  /** Cosine similarity (-1..1) when shown as a recommendation. */
  similarity?: number | null;
}

const percentFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'percent',
  maximumFractionDigits: 0,
});

export const CommunityBuildCard = ({
  build,
  currentVersion,
  canFavorite,
  similarity,
}: CommunityBuildCardProps) => {
  const updated = wasUpdatedAfterPublication(
    build.publishedAt,
    build.contentUpdatedAt,
  );

  return (
    <article className={styles.card}>
      <div className={styles.badges}>
        <SpecializationBadge
          specialization={build.specialization}
          detected={build.detectedSpecialization}
        />
        <VersionBadge
          version={build.gameVersion}
          currentVersion={currentVersion}
        />
        {build.isMine ? <span className={styles.mine}>Mon build</span> : null}
        {canFavorite && !build.isMine ? (
          <span className={styles.favorite}>
            <FavoriteButton
              publicationId={build.id}
              isFavorite={build.isFavorite}
            />
          </span>
        ) : null}
      </div>

      <h3 className={styles.title}>
        <Link
          to={Routes.communityById}
          params={{ id: build.id }}
          className={styles.link}
        >
          {build.title}
        </Link>
      </h3>

      <p className={styles.meta}>
        par <strong>{build.authorPseudo}</strong> · {build.race}{' '}
        {GENDER_LABELS[build.gender].toLowerCase()} ·{' '}
        {describeWeapons(build.weaponTypes, build.hasHealWeapon)}
      </p>

      <div className={styles.rating}>
        <StarRatingDisplay
          value={build.ratingAverage}
          count={build.ratingCount}
        />
        {similarity !== undefined && similarity !== null && similarity > 0 ? (
          <span className={styles.similarity}>
            Similarité {percentFormatter.format(similarity)}
          </span>
        ) : null}
      </div>

      {build.keyStats.length > 0 ? (
        <dl className={styles.stats}>
          {build.keyStats.map(({ stat, value }) => (
            <div key={stat} className={styles.stat}>
              <dt title={StatValues[stat].label}>{StatValues[stat].tag}</dt>
              <dd>{formatStatValue(value)}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      <p className={styles.date}>
        {updated
          ? `Mis à jour le ${formatCommunityDate(build.contentUpdatedAt)}`
          : `Publié le ${formatCommunityDate(build.publishedAt)}`}
      </p>
    </article>
  );
};
