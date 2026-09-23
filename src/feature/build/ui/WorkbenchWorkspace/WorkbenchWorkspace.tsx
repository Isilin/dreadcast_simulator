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
  techCost: number;
  draggedData: WorkbenchDragData | null;
  selectedDrug: Drug | null;
  onActivateSpot: (spot: ItemSpot) => void;
  onKitOpen: (spot: ItemSpot) => void;
  onDamageBonusChange: (spot: ItemSpot, bonus: DamageBonusType) => void;
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
  techCost,
  draggedData,
  selectedDrug,
  onActivateSpot,
  onKitOpen,
  onDamageBonusChange,
  onKitDelete,
  onDrugActivate,
  onDrugClear,
}: WorkbenchWorkspaceProps) => (
  <section className={styles.workspace} aria-label="Atelier de build">
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Build actif</p>
        <h2>{getWorkspaceTitle(catalogueFilter)}</h2>
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
        onDrugActivate={onDrugActivate}
        onDrugClear={onDrugClear}
      />

      {catalogueFilter === 'kits' ? (
        <div className={styles.kitTools}>
          <KitRack
            activeItem={activeItem}
            kits={kits}
            techCost={techCost}
            spot={activeSpot}
            spotLabel={workbenchSlotLabels[activeSpot]}
            onDelete={onKitDelete}
          />
        </div>
      ) : null}
    </div>
  </section>
);
