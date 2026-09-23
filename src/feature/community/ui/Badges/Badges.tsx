import styles from './Badges.module.css';
import { SPECIALIZATION_LABELS, type Specialization } from '../../model';

interface SpecializationBadgeProps {
  specialization: Specialization;
  detected?: Specialization;
}

export const SpecializationBadge = ({
  specialization,
  detected,
}: SpecializationBadgeProps) => {
  const differs = detected !== undefined && detected !== specialization;

  return (
    <span
      className={styles.specialization}
      data-specialization={specialization}
      title={
        differs
          ? `Choisie par l'auteur (détectée : ${SPECIALIZATION_LABELS[detected]})`
          : undefined
      }
    >
      {SPECIALIZATION_LABELS[specialization]}
    </span>
  );
};

interface VersionBadgeProps {
  version: string;
  currentVersion: string | null | undefined;
}

/**
 * Game version of a publication; highlighted when outdated.
 */
export const VersionBadge = ({
  version,
  currentVersion,
}: VersionBadgeProps) => {
  const isOutdated = Boolean(currentVersion) && version !== currentVersion;

  return (
    <span
      className={isOutdated ? styles.versionOutdated : styles.version}
      title={
        isOutdated
          ? `Publié pour la ${version}, version actuelle : ${currentVersion}`
          : `Version du jeu ${version}`
      }
    >
      {isOutdated ? `Ancienne version · ${version}` : version}
    </span>
  );
};
