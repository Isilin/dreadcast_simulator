import { Link } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

import styles from './CommunityPage.module.css';
import {
  COMMUNITY_SORT_LABELS,
  CommunitySortValues,
  DEFAULT_COMMUNITY_FILTERS,
  type CommunityFilters as Filters,
  type CommunitySort,
} from '../../model';
import {
  useCommunityMeta,
  useCommunitySearch,
  useMyPublications,
} from '../../services';
import { GuestGate } from '../AccessGate';
import { CommunityBuildCard } from '../CommunityBuildCard';
import { CommunityFilters } from '../CommunityFilters';
import { ForYouSection } from '../ForYouSection';

import { useActiveSubscription } from '@/feature/subscription';
import { Spinner } from '@/ui';
import Routes from '@/utils/routes';

interface CommunityPageProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
}

/** Advanced filters of a shared URL are ignored for non-subscribers. */
const stripAdvancedFilters = (filters: Filters): Filters => ({
  ...filters,
  minStats: {},
  implants: [],
  drugs: [],
  items: [],
  favoritesOnly: false,
});

export const CommunityPage = ({
  filters,
  onFiltersChange,
}: CommunityPageProps) => {
  const {
    isAuthenticated,
    isSubscriber,
    isLoading: isAccessLoading,
  } = useActiveSubscription();
  const { data: meta } = useCommunityMeta();
  const effectiveFilters = useMemo(
    () => (isSubscriber ? filters : stripAdvancedFilters(filters)),
    [filters, isSubscriber],
  );
  const search = useCommunitySearch(effectiveFilters, {
    enabled: !isAccessLoading,
  });
  const { data: myPublications = [] } = useMyPublications();

  const handleChange = useCallback(
    (changes: Partial<Filters>) =>
      onFiltersChange({ ...filters, page: 1, ...changes }),
    [filters, onFiltersChange],
  );
  const handleReset = useCallback(
    () => onFiltersChange({ ...DEFAULT_COMMUNITY_FILTERS, sort: filters.sort }),
    [filters.sort, onFiltersChange],
  );

  const result = search.data;
  const pageCount = result
    ? Math.max(1, Math.ceil(result.total / result.pageSize))
    : 1;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.overline}>Communauté</p>
        <h1 className={styles.title}>Builds de la Communauté</h1>
        <p className={styles.subtitle}>
          Parcourez les builds publiés par les abonnés, filtrez par
          spécialisation ou par statistiques, notez-les et copiez-les dans votre
          atelier.
        </p>
      </header>

      {!isAccessLoading && !isAuthenticated ? (
        <GuestGate title="Connectez-vous pour explorer la Communauté">
          <p>
            La Communauté est ouverte aux membres connectés. Les abonnés peuvent
            aussi publier, noter et copier des builds.
          </p>
        </GuestGate>
      ) : null}

      {isAuthenticated ? (
        <>
          {!isAccessLoading && !isSubscriber ? (
            <p className={styles.preview}>
              <strong>Mode aperçu.</strong> Le détail des builds, les filtres
              avancés, la notation et la copie sont réservés aux abonnés.{' '}
              <Link to={Routes.subscription}>Voir les abonnements</Link>
            </p>
          ) : null}

          {myPublications.length > 0 ? (
            <nav className={styles.mine} aria-label="Mes publications">
              <span className={styles.mineLabel}>Mes publications</span>
              <ul className={styles.mineList}>
                {myPublications.map((publication) => (
                  <li key={publication.id}>
                    <Link
                      to={Routes.communityById}
                      params={{ id: publication.id }}
                      className={styles.mineLink}
                    >
                      {publication.title}
                      {publication.frozen ? ' · figée' : ''}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {isSubscriber ? (
            <ForYouSection currentVersion={meta?.currentVersion} />
          ) : null}

          <div className={styles.layout}>
            <CommunityFilters
              filters={filters}
              onChange={handleChange}
              onReset={handleReset}
              isSubscriber={isSubscriber}
              versions={meta?.versions ?? []}
              currentVersion={meta?.currentVersion}
            />

            <section className={styles.results} aria-live="polite">
              <div className={styles.toolbar}>
                <p className={styles.count}>
                  {result
                    ? `${result.total} build${result.total > 1 ? 's' : ''}`
                    : 'Recherche…'}
                  {search.isFetching && result ? (
                    <Spinner size={12} label="Mise à jour" />
                  ) : null}
                </p>
                <label className={styles.sort}>
                  <span>Trier par</span>
                  <select
                    className={styles.sortSelect}
                    value={filters.sort}
                    onChange={(event) =>
                      handleChange({
                        sort: event.target.value as CommunitySort,
                      })
                    }
                  >
                    {CommunitySortValues.map((sort) => (
                      <option key={sort} value={sort}>
                        {COMMUNITY_SORT_LABELS[sort]}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {search.isPending ? (
                <div className={styles.state}>
                  <Spinner />
                </div>
              ) : null}

              {search.isError ? (
                <p className={styles.error} role="alert">
                  {search.error.message}
                </p>
              ) : null}

              {result && result.items.length === 0 ? (
                <div className={styles.state}>
                  <p>Aucun build ne correspond à ces critères.</p>
                </div>
              ) : null}

              {result && result.items.length > 0 ? (
                <ul className={styles.grid}>
                  {result.items.map((build) => (
                    <li key={build.id}>
                      <CommunityBuildCard
                        build={build}
                        currentVersion={meta?.currentVersion}
                        canFavorite={isSubscriber}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}

              {result && pageCount > 1 ? (
                <nav className={styles.pagination} aria-label="Pagination">
                  <button
                    type="button"
                    className={styles.pageButton}
                    disabled={filters.page <= 1}
                    onClick={() => handleChange({ page: filters.page - 1 })}
                  >
                    Précédent
                  </button>
                  <span className={styles.pageInfo}>
                    Page {filters.page} / {pageCount}
                  </span>
                  <button
                    type="button"
                    className={styles.pageButton}
                    disabled={filters.page >= pageCount}
                    onClick={() => handleChange({ page: filters.page + 1 })}
                  >
                    Suivant
                  </button>
                </nav>
              ) : null}
            </section>
          </div>
        </>
      ) : null}
    </div>
  );
};
