import styles from './ForYouSection.module.css';
import { useForYou } from '../../services';
import { CommunityBuildCard } from '../CommunityBuildCard';

import { Spinner } from '@/ui';

interface ForYouSectionProps {
  currentVersion: string | null | undefined;
}

/**
 * Subscriber recommendations: builds close to the ones they published,
 * favorited or rated 4+ stars; trending builds until there is a signal.
 */
export const ForYouSection = ({ currentVersion }: ForYouSectionProps) => {
  const { data, isPending, isError } = useForYou();

  if (isError || (data && data.items.length === 0)) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="for-you-title">
      <div className={styles.header}>
        <h2 id="for-you-title" className={styles.title}>
          {data?.strategy === 'trending' ? 'Tendances du moment' : 'Pour vous'}
        </h2>
        <p className={styles.hint}>
          {data?.strategy === 'trending'
            ? 'Publiez, notez ou ajoutez des builds en favori pour recevoir des recommandations.'
            : 'Des profils de stats proches des builds que vous publiez, aimez ou notez.'}
        </p>
      </div>

      {isPending ? (
        <div className={styles.loading}>
          <Spinner />
        </div>
      ) : (
        <ul className={styles.list}>
          {data.items.map((build) => (
            <li key={build.id}>
              <CommunityBuildCard
                build={build}
                currentVersion={currentVersion}
                canFavorite
                similarity={build.similarity}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
