import { useEffect, useState } from 'react';

import styles from './BuildNameEditor.module.css';
import type { BuildPersistenceState } from '../../model/persitence.hook';
import { getDefaultBuildName } from '../../services';

interface BuildNameEditorProps {
  persistence: BuildPersistenceState;
}

export const BuildNameEditor = ({ persistence }: BuildNameEditorProps) => {
  const { active, builds, getBuildName, setActiveBuildName } = persistence;
  const [draftName, setDraftName] = useState(getBuildName(active));

  useEffect(() => {
    const persistedName = builds[active]?.name?.trim();
    setDraftName(
      persistedName && persistedName.length > 0
        ? persistedName
        : getDefaultBuildName(active),
    );
  }, [active, builds]);

  const commitName = () => {
    setActiveBuildName(draftName);
  };

  return (
    <div className={styles.container}>
      <label htmlFor="build-name-input" className={styles.label}>
        Nom du build
      </label>
      <input
        id="build-name-input"
        type="text"
        className={styles.input}
        value={draftName}
        onChange={(event) => setDraftName(event.target.value)}
        onBlur={commitName}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
            return;
          }

          if (event.key === 'Escape') {
            setDraftName(getBuildName(active));
            event.currentTarget.blur();
          }
        }}
        aria-label="Nom du build"
        title={getBuildName(active)}
        maxLength={64}
      />
    </div>
  );
};

export default BuildNameEditor;
