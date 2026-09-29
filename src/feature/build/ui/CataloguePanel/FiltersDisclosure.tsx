import { useId, useState, type ReactNode } from 'react';

import styles from './CataloguePanel.module.css';

interface FiltersDisclosureProps {
  activeCount: number;
  onReset: () => void;
  children: ReactNode;
}

/** Collapsible "Filtres (n)" panel of a catalogue, with a reset button. */
export const FiltersDisclosure = ({
  activeCount,
  onReset,
  children,
}: FiltersDisclosureProps) => {
  const panelId = useId();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.filtersDisclosure}>
      <div className={styles.filtersBar}>
        <button
          type="button"
          className={styles.filtersToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true">{isOpen ? '▾' : '▸'}</span>
          Filtres{activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
        <button
          type="button"
          className={styles.filtersReset}
          disabled={activeCount === 0}
          onClick={onReset}
        >
          Réinitialiser
        </button>
      </div>

      {isOpen ? (
        <div id={panelId} className={styles.filtersPanel}>
          {children}
        </div>
      ) : null}
    </div>
  );
};
