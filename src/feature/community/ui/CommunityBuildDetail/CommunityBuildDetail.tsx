import { Dialog } from '@base-ui/react/dialog';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';

import styles from './CommunityBuildDetail.module.css';
import {
  computeSnapshotStats,
  describeWeapons,
  findMissingSnapshotIds,
  formatCommunityDate,
  formatStatValue,
  GENDER_LABELS,
  wasUpdatedAfterPublication,
} from '../../model';
import {
  COMMUNITY_API_ERROR_CODE,
  CommunityRepositoryError,
  useBuildCatalogs,
  useCommunityBuild,
  useCommunityMeta,
  useCopyCommunityBuild,
  useUnpublishBuild,
} from '../../services';
import { GuestGate, SubscriberGate } from '../AccessGate';
import { SpecializationBadge, VersionBadge } from '../Badges';
import { BuildSheet } from '../BuildSheet';
import { CompareDialog } from '../CompareDialog';
import { FavoriteButton } from '../FavoriteButton';
import { ReviewSection } from '../ReviewSection';
import { StarRatingDisplay } from '../StarRating';

import { StatValues } from '@/domain';
import { useActiveSubscription } from '@/feature/subscription';
import { Modal, Spinner } from '@/ui';
import Routes from '@/utils/routes';

const LOCKED_DETAIL_TEXT =
  'Équipement, kits, implants, statistiques complètes, avis, copie dans votre atelier et comparaison sont accessibles avec un abonnement.';

interface CommunityBuildDetailProps {
  id: string;
}

export const CommunityBuildDetail = ({ id }: CommunityBuildDetailProps) => {
  const navigate = useNavigate();
  const { isAuthenticated, isSubscriber } = useActiveSubscription();
  const detail = useCommunityBuild(id);
  const { data: meta } = useCommunityMeta();
  const { catalogs, isError: isCatalogError } = useBuildCatalogs();
  const copyBuild = useCopyCommunityBuild();
  const unpublish = useUnpublishBuild();
  const [isCopyConfirmVisible, setIsCopyConfirmVisible] = useState(false);
  const [isUnpublishOpen, setIsUnpublishOpen] = useState(false);

  const build = detail.data;
  const content = build?.content ?? null;
  const summary = build?.summary;
  const isOutdated = Boolean(
    summary &&
    meta?.currentVersion &&
    summary.gameVersion !== meta.currentVersion,
  );

  const missingIds = useMemo(
    () =>
      content && catalogs
        ? findMissingSnapshotIds(content.snapshot, catalogs)
        : [],
    [catalogs, content],
  );

  // Current version: stats recomputed from the frozen snapshot. Old version
  // or missing objects: stats as they were at publication time.
  const stats = useMemo(() => {
    if (!content) return null;
    if (!catalogs || isOutdated || missingIds.length > 0) return content.stats;
    return computeSnapshotStats(content.snapshot, catalogs);
  }, [catalogs, content, isOutdated, missingIds.length]);

  if (detail.isPending) {
    return (
      <div className={styles.state}>
        <Spinner />
        <p>Chargement du build…</p>
      </div>
    );
  }

  if (detail.isError || !build || !summary) {
    const notFound =
      detail.error instanceof CommunityRepositoryError &&
      detail.error.code === COMMUNITY_API_ERROR_CODE.PUBLICATION_NOT_FOUND;

    return (
      <div className={styles.state}>
        <h1 className={styles.stateTitle}>
          {notFound ? 'Publication introuvable' : 'Build indisponible'}
        </h1>
        <p>
          {notFound
            ? "Ce build a été dépublié ou n'existe pas."
            : detail.error?.message}
        </p>
        <Link to={Routes.community} className={styles.backButton}>
          Retour à la Communauté
        </Link>
      </div>
    );
  }

  const needsCopyConfirmation = isOutdated || missingIds.length > 0;

  const handleCopy = () => {
    if (needsCopyConfirmation && !isCopyConfirmVisible) {
      setIsCopyConfirmVisible(true);
      return;
    }

    copyBuild.mutate(id, {
      onSuccess: (slot) => {
        void navigate({ to: Routes.home, search: { slot } });
      },
    });
  };

  const handleUnpublish = () => {
    unpublish.mutate(id, {
      onSuccess: () => {
        setIsUnpublishOpen(false);
        void navigate({ to: Routes.community });
      },
    });
  };

  return (
    <div className={styles.page}>
      <Link to={Routes.community} className={styles.back}>
        ← Communauté
      </Link>

      <header className={styles.header}>
        <div className={styles.badges}>
          <SpecializationBadge
            specialization={summary.specialization}
            detected={summary.detectedSpecialization}
          />
          <VersionBadge
            version={summary.gameVersion}
            currentVersion={meta?.currentVersion}
          />
        </div>
        <h1 className={styles.title}>{summary.title}</h1>
        <p className={styles.meta}>
          par <strong>{summary.authorPseudo}</strong> · {summary.race}{' '}
          {GENDER_LABELS[summary.gender].toLowerCase()} ·{' '}
          {describeWeapons(summary.weaponTypes, summary.hasHealWeapon)}
        </p>
        <div className={styles.rating}>
          <StarRatingDisplay
            value={summary.ratingAverage}
            count={summary.ratingCount}
          />
          <span className={styles.dates}>
            Publié le {formatCommunityDate(summary.publishedAt)}
            {wasUpdatedAfterPublication(
              summary.publishedAt,
              summary.contentUpdatedAt,
            )
              ? ` · mis à jour le ${formatCommunityDate(summary.contentUpdatedAt)}`
              : ''}
          </span>
        </div>
        {summary.description ? (
          <p className={styles.description}>{summary.description}</p>
        ) : null}
      </header>

      {build.locked ? (
        <>
          {summary.keyStats.length > 0 ? (
            <dl className={styles.keyStats}>
              {summary.keyStats.map(({ stat, value }) => (
                <div key={stat}>
                  <dt>{StatValues[stat].label}</dt>
                  <dd>{formatStatValue(value)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {isAuthenticated ? (
            <SubscriberGate title="Détail complet réservé aux abonnés">
              <p>{LOCKED_DETAIL_TEXT}</p>
            </SubscriberGate>
          ) : (
            <GuestGate title="Détail complet réservé aux abonnés">
              <p>{LOCKED_DETAIL_TEXT}</p>
            </GuestGate>
          )}
        </>
      ) : null}

      {content ? (
        <>
          <div className={styles.actions}>
            {isSubscriber ? (
              <button
                type="button"
                className={styles.primaryAction}
                onClick={handleCopy}
                disabled={copyBuild.isPending}
              >
                {copyBuild.isPending
                  ? 'Copie…'
                  : isCopyConfirmVisible
                    ? 'Confirmer la copie'
                    : 'Copier dans mes builds'}
              </button>
            ) : null}
            {isSubscriber && !summary.isMine ? (
              <FavoriteButton
                publicationId={summary.id}
                isFavorite={summary.isFavorite}
                withLabel
              />
            ) : null}
            {isSubscriber && catalogs && stats ? (
              <CompareDialog
                title={summary.title}
                publishedStats={stats}
                catalogs={catalogs}
              />
            ) : null}
            {summary.isMine ? (
              <button
                type="button"
                className={styles.dangerAction}
                onClick={() => setIsUnpublishOpen(true)}
              >
                Dépublier
              </button>
            ) : null}
          </div>

          {isCopyConfirmVisible ? (
            <p className={styles.warning} role="alert">
              Ce build a été publié pour une autre version du jeu : les objets
              qui n'existent plus seront ignorés dans la copie.
            </p>
          ) : null}
          {copyBuild.isError ? (
            <p className={styles.error} role="alert">
              {copyBuild.error.message}
            </p>
          ) : null}
          {summary.isMine ? (
            <p className={styles.muted}>
              Pour mettre à jour cette publication, ouvrez le build dans
              l'atelier puis « Mettre à jour la publication ».
            </p>
          ) : null}

          {isOutdated || missingIds.length > 0 ? (
            <p className={styles.warning}>
              {isOutdated ? `Publié pour la ${summary.gameVersion}. ` : ''}
              Les statistiques affichées sont celles de la publication
              {missingIds.length > 0
                ? ` ; ${missingIds.length} objet(s) n'existent plus dans la version actuelle.`
                : '.'}
            </p>
          ) : null}

          {isCatalogError ? (
            <p className={styles.error} role="alert">
              Impossible de charger les données du jeu.
            </p>
          ) : null}
          {catalogs && stats ? (
            <BuildSheet
              snapshot={content.snapshot}
              catalogs={catalogs}
              stats={stats}
            />
          ) : (
            !isCatalogError && <Spinner />
          )}
        </>
      ) : null}

      <ReviewSection
        publicationId={summary.id}
        isSubscriber={build.isSubscriber}
        isMine={summary.isMine}
        myReview={build.myReview}
      />

      <Dialog.Root open={isUnpublishOpen} onOpenChange={setIsUnpublishOpen}>
        <Modal>
          <Modal.Header>
            <Modal.Title>Dépublier ce build ?</Modal.Title>
          </Modal.Header>
          <Modal.Content>
            <div className={styles.dialogBody}>
              <p>
                La publication, ses notes et ses avis seront définitivement
                supprimés. Votre build reste dans votre atelier.
              </p>
              {unpublish.isError ? (
                <p className={styles.error} role="alert">
                  {unpublish.error.message}
                </p>
              ) : null}
            </div>
          </Modal.Content>
          <Modal.Footer>
            <Modal.Close />
            <button
              type="button"
              className={styles.dangerAction}
              onClick={handleUnpublish}
              disabled={unpublish.isPending}
            >
              {unpublish.isPending ? 'Suppression…' : 'Dépublier'}
            </button>
          </Modal.Footer>
        </Modal>
      </Dialog.Root>
    </div>
  );
};
