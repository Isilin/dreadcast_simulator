import { Dialog } from '@base-ui/react/dialog';
import { Link } from '@tanstack/react-router';
import { useId, useMemo, useState, type FormEvent } from 'react';

import styles from './PublishBuildDialog.module.css';
import {
  buildPublishPayload,
  buildRefreshPayload,
  DESCRIPTION_MAX_LENGTH,
  detectSpecialization,
  getWeaponSummary,
  SPECIALIZATION_LABELS,
  SpecializationValues,
  TITLE_MAX_LENGTH,
  validatePublicationDescription,
  validatePublicationTitle,
  type MyPublication,
  type Specialization,
} from '../../model';
import { usePublishBuild, useUpdatePublication } from '../../services';

import { PseudoForm, useAccountProfile } from '@/feature/account';
import { useItemsState } from '@/feature/item';
import type { useBuildPersistence } from '@/feature/persistence';
import { useRaceStats } from '@/feature/profile';
import { BASE_HEALTH_STAMINA, useSuitSelector } from '@/feature/suit';
import { Modal, Spinner } from '@/ui';
import Routes from '@/utils/routes';

type BuildPersistence = ReturnType<typeof useBuildPersistence>;

interface PublishBuildDialogProps {
  persistence: BuildPersistence;
  /** Existing publication of the active slot: the dialog updates it. */
  publication: MyPublication | undefined;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PublishBuildDialog = ({
  persistence,
  publication,
  open,
  onOpenChange,
}: PublishBuildDialogProps) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Modal>
      <Modal.Header>
        <Modal.Title>
          {publication
            ? 'Mettre à jour la publication'
            : 'Publier dans la Communauté'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {open ? (
          <PublishBuildForm
            persistence={persistence}
            publication={publication}
            onDone={() => onOpenChange(false)}
          />
        ) : null}
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close />
      </Modal.Footer>
    </Modal>
  </Dialog.Root>
);

interface PublishBuildFormProps {
  persistence: BuildPersistence;
  publication: MyPublication | undefined;
  onDone: () => void;
}

const PublishBuildForm = ({
  persistence,
  publication,
  onDone,
}: PublishBuildFormProps) => {
  const idPrefix = useId();
  const { data: profile, isPending: isProfilePending } = useAccountProfile();
  const stats = useSuitSelector();
  const raceStats = useRaceStats();
  const items = useItemsState();
  const publishBuild = usePublishBuild();
  const updatePublication = useUpdatePublication();

  const detected = useMemo(
    () =>
      detectSpecialization({
        stats,
        raceBase: raceStats,
        baseHealth: BASE_HEALTH_STAMINA,
        weapons: getWeaponSummary(items),
      }).code,
    [items, raceStats, stats],
  );

  const [title, setTitle] = useState(
    publication?.title ?? persistence.getBuildName(persistence.active),
  );
  const [description, setDescription] = useState(
    publication?.description ?? '',
  );
  const [specialization, setSpecialization] = useState<Specialization>(
    publication?.specialization ?? detected,
  );
  const [validationError, setValidationError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  if (isProfilePending) {
    return <Spinner />;
  }

  if (!profile?.pseudo) {
    return (
      <div className={styles.body}>
        <p className={styles.muted}>
          Avant de publier, choisissez le pseudo qui signera vos builds.
        </p>
        <PseudoForm submitLabel="Enregistrer et continuer" />
      </div>
    );
  }

  if (publishedId) {
    return (
      <div className={styles.body}>
        <p className={styles.success} role="status">
          {publication
            ? 'Publication mise à jour. Les notes sont conservées.'
            : 'Build publié dans la Communauté !'}
        </p>
        <div className={styles.actions}>
          <Link
            to={Routes.communityById}
            params={{ id: publishedId }}
            className={styles.submit}
          >
            Voir la publication
          </Link>
          <button type="button" className={styles.secondary} onClick={onDone}>
            Continuer dans l'atelier
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error =
      validatePublicationTitle(title) ??
      validatePublicationDescription(description);
    setValidationError(error);
    if (error) return;

    setSaveError(null);
    setIsSaving(true);

    try {
      // The server copies the saved build: flush the latest edits first.
      await persistence.saveActiveBuildNow();

      const input = {
        title,
        description,
        specialization,
        detectedSpecialization: detected,
        stats,
      };

      if (publication) {
        await updatePublication.mutateAsync({
          id: publication.id,
          payload: buildRefreshPayload(input),
        });
        setPublishedId(publication.id);
      } else {
        const id = await publishBuild.mutateAsync(
          buildPublishPayload(persistence.active, input),
        );
        setPublishedId(id);
      }
    } catch (caught) {
      setSaveError(
        caught instanceof Error
          ? caught.message
          : 'Impossible de publier ce build.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className={styles.body}
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      <p className={styles.muted}>
        {publication
          ? "Remplace la copie publiée par l'état actuel du build. Les notes et avis sont conservés."
          : "Une copie figée du build actuel est publiée. Vos modifications suivantes n'apparaîtront qu'après « Mettre à jour la publication »."}
      </p>

      <label htmlFor={`${idPrefix}-title`} className={styles.label}>
        Titre
      </label>
      <input
        id={`${idPrefix}-title`}
        className={styles.input}
        value={title}
        maxLength={TITLE_MAX_LENGTH}
        onChange={(event) => setTitle(event.target.value)}
      />

      <label htmlFor={`${idPrefix}-specialization`} className={styles.label}>
        Spécialisation
      </label>
      <select
        id={`${idPrefix}-specialization`}
        className={styles.input}
        value={specialization}
        onChange={(event) =>
          setSpecialization(event.target.value as Specialization)
        }
      >
        {SpecializationValues.map((value) => (
          <option key={value} value={value}>
            {SPECIALIZATION_LABELS[value]}
            {value === detected ? ' (détectée)' : ''}
          </option>
        ))}
      </select>
      <p className={styles.hint}>
        Détectée d'après les statistiques : {SPECIALIZATION_LABELS[detected]}.
      </p>

      <label htmlFor={`${idPrefix}-description`} className={styles.label}>
        Description (facultative)
      </label>
      <textarea
        id={`${idPrefix}-description`}
        className={styles.textarea}
        value={description}
        maxLength={DESCRIPTION_MAX_LENGTH}
        placeholder="Usage, points forts, variantes…"
        onChange={(event) => setDescription(event.target.value)}
      />

      {validationError || saveError ? (
        <p className={styles.error} role="alert">
          {validationError ?? saveError}
        </p>
      ) : null}

      <div className={styles.actions}>
        <button type="submit" className={styles.submit} disabled={isSaving}>
          {isSaving
            ? 'Publication…'
            : publication
              ? 'Mettre à jour'
              : 'Publier'}
        </button>
      </div>
    </form>
  );
};
