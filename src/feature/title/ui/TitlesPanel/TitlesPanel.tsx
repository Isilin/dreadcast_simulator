import styles from './TitlesPanel.module.css';
import { useTitlesActions, useTitlesState } from '../../model/title.store';
import { useTitles } from '../../services';

import { useBuildReadOnlyMode } from '@/feature/persistence';

/** Titles unlocked by the character: prerequisites of some items and kits. */
export const TitlesPanel = () => {
  const { data: titles = [], status } = useTitles();
  const unlocked = useTitlesState();
  const { toggleTitle } = useTitlesActions();
  const isReadOnly = useBuildReadOnlyMode();
  const unlockedCount = titles.filter(({ id }) => unlocked.includes(id)).length;

  return (
    <div className={styles.panel}>
      <p className={styles.summary}>
        Titres débloqués <span>{unlockedCount}</span>
      </p>
      {status === 'pending' ? (
        <p className={styles.message}>Chargement des titres...</p>
      ) : null}
      {status === 'error' ? (
        <p className={styles.message} role="alert">
          Titres indisponibles.
        </p>
      ) : null}
      {status === 'success' && titles.length === 0 ? (
        <p className={styles.message}>Aucun titre référencé pour l’instant.</p>
      ) : null}
      <ul className={styles.list}>
        {titles.map((title) => {
          const checked = unlocked.includes(title.id);
          return (
            <li key={title.id} className={styles.row} data-active={checked}>
              <label className={styles.label}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={checked}
                  disabled={isReadOnly}
                  onChange={() => toggleTitle(title.id)}
                />
                <span className={styles.name}>{title.name}</span>
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
