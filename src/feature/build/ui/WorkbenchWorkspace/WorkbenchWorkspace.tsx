import styles from './WorkbenchWorkspace.module.css';
import type { WorkbenchDragData } from '../../model/drag-drop.types';
import {
  getModeTarget,
  getModeTitle,
  type CatalogueFilter,
  type WorkbenchMode,
} from '../../model/workbench.types';
import { RemovalDock } from '../RemovalDock';
import { WorkbenchBoard } from '../WorkbenchBoard';

import type { ItemSpot } from '@/domain';
import type { Drug } from '@/feature/drug';
import { ImplantBay, type Implant, type ImplantsState } from '@/feature/implant';
import {
  type DamageBonusType,
  type Item,
  type ItemsState,
} from '@/feature/item';
import { KitRack, type KitSelection, type KitsState } from '@/feature/kit';

interface WorkbenchWorkspaceProps {
  activeMode: WorkbenchMode;
  catalogueFilter: CatalogueFilter;
  activeSpot: ItemSpot;
  activeItem: Item | null;
  items: ItemsState;
  kits: KitSelection[];
  kitsBySpot: KitsState;
  techCost: number;
  allImplants: Implant[];
  implantLevels: ImplantsState;
  draggedData: WorkbenchDragData | null;
  selectedDrug: Drug | null;
  onActivateSpot: (spot: ItemSpot) => void;
  onKitOpen: (spot: ItemSpot) => void;
  onDamageBonusChange: (spot: ItemSpot, bonus: DamageBonusType) => void;
  onKitDelete: (index: number) => void;
  onImplantRemove: (implant: Implant) => void;
  onDrugActivate: () => void;
  onDrugClear: () => void;
}

export const WorkbenchWorkspace = ({
  activeMode,
  catalogueFilter,
  activeSpot,
  activeItem,
  items,
  kits,
  kitsBySpot,
  techCost,
  allImplants,
  implantLevels,
  draggedData,
  selectedDrug,
  onActivateSpot,
  onKitOpen,
  onDamageBonusChange,
  onKitDelete,
  onImplantRemove,
  onDrugActivate,
  onDrugClear,
}: WorkbenchWorkspaceProps) => (
  <section className={styles.workspace} aria-label="Atelier de build">
    <header className={styles.header}>
      <div>
        <p className={styles.eyebrow}>Build actif</p>
        <h2>{getModeTitle(activeMode, catalogueFilter)}</h2>
      </div>
      <p className={styles.activeTarget}>
        Cible: <strong>{getModeTarget(activeMode, catalogueFilter, activeSpot)}</strong>
      </p>
    </header>

    {activeMode === 'equipment' ? (
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
    ) : null}

    {activeMode === 'equipment' && catalogueFilter === 'kits' ? (
      <>
        <KitRack
          activeItem={activeItem}
          kits={kits}
          techCost={techCost}
          spot={activeSpot}
          spotLabel={getModeTarget('equipment', 'kits', activeSpot)}
          onDelete={onKitDelete}
        />
        <RemovalDock spot={activeSpot} />
      </>
    ) : null}

    {activeMode === 'implants' ? (
      <>
        <ImplantBay
          implants={allImplants}
          levels={implantLevels}
          onRemove={onImplantRemove}
        />
        <RemovalDock spot={activeSpot} />
      </>
    ) : null}

    {activeMode === 'equipment' && catalogueFilter === 'drugs' ? (
      <RemovalDock spot={activeSpot} />
    ) : null}
  </section>
);
