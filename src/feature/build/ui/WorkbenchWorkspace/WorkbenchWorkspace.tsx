import { lazy, Suspense } from 'react';

import styles from './WorkbenchWorkspace.module.css';
import type { WorkbenchDragData } from '../../model/drag-drop.types';
import {
  getWorkspaceTitle,
  workbenchSlotLabels,
  type CatalogueFilter,
} from '../../model/workbench.types';
import { WorkbenchBoard } from '../WorkbenchBoard';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import {
  type DamageBonusType,
  type Item,
  type ItemsState,
} from '@/feature/item';
import { KitRack, type KitSelection, type KitsState } from '@/feature/kit';
import {
  BuildNameEditor,
  type BuildPersistenceState,
} from '@/feature/persistence';
import { ArrowLeftIcon } from '@/ui/Icon';

// The Communauté code stays out of the workbench chunk until the button
// renders.
const PublishBuildButton = lazy(() =>
  import('@/feature/community').then(({ PublishBuildButton: Button }) => ({
    default: Button,
  })),
);

interface WorkbenchWorkspaceProps {
  persistence: BuildPersistenceState;
  catalogueFilter: CatalogueFilter;
  activeSpot: ItemSpot;
  activeItem: Item | null;
  items: ItemsState;
  kits: KitSelection[];
  kitsBySpot: KitsState;
  draggedData: WorkbenchDragData | null;
  selectedDrug: Drug | null;
  onActivateSpot: (spot: ItemSpot) => void;
  onKitOpen: (spot: ItemSpot) => void;
  onKitClose: () => void;
  onDamageBonusChange: (spot: ItemSpot, bonus: DamageBonusType) => void;
  onItemRemove: (spot: ItemSpot) => void;
  onKitIncrease: (index: number) => void;
  onKitDecrease: (index: number) => void;
  onKitDelete: (index: number) => void;
  onDrugActivate: () => void;
  onDrugClear: () => void;
}

export const WorkbenchWorkspace = ({
  persistence,
  catalogueFilter,
  activeSpot,
  activeItem,
  items,
  kits,
  kitsBySpot,
  draggedData,
  selectedDrug,
  onActivateSpot,
  onKitOpen,
  onKitClose,
  onDamageBonusChange,
  onItemRemove,
  onKitIncrease,
  onKitDecrease,
  onKitDelete,
  onDrugActivate,
  onDrugClear,
}: WorkbenchWorkspaceProps) => {
  const isKitView = catalogueFilter === 'kits';

  return (
    <section className={styles.workspace} aria-label="Atelier de build">
      <header className={styles.header}>
        <div className={styles.titleGroup}>
          {isKitView ? (
            <button
              type="button"
              className={styles.back}
              onClick={onKitClose}
              aria-label="Retour au poste d'équipement"
              title="Retour au poste d'équipement"
            >
              <ArrowLeftIcon />
            </button>
          ) : null}
          <div>
            <p className={styles.eyebrow}>Build actif</p>
            <h2>{getWorkspaceTitle(catalogueFilter)}</h2>
          </div>
        </div>
        <div className={styles.buildActions}>
          <div className={styles.buildName}>
            <BuildNameEditor persistence={persistence} />
          </div>
          <Suspense fallback={null}>
            <PublishBuildButton persistence={persistence} />
          </Suspense>
        </div>
      </header>

      <div className={styles.body}>
        {isKitView ? (
          <KitRack
            activeItem={activeItem}
            kits={kits}
            spot={activeSpot}
            spotLabel={workbenchSlotLabels[activeSpot]}
            onIncrease={onKitIncrease}
            onDecrease={onKitDecrease}
            onDelete={onKitDelete}
          />
        ) : (
          <WorkbenchBoard
            items={items}
            kitsBySpot={kitsBySpot}
            activeSpot={activeSpot}
            draggedData={draggedData}
            selectedDrug={selectedDrug}
            catalogueFilter={catalogueFilter}
            onActivateSpot={onActivateSpot}
            onKitOpen={onKitOpen}
            onDamageBonusChange={onDamageBonusChange}
            onItemRemove={onItemRemove}
            onDrugActivate={onDrugActivate}
            onDrugClear={onDrugClear}
          />
        )}
      </div>
    </section>
  );
};
