import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';

import styles from './BuildWorkbench.module.css';
import { useWorkbenchDnd } from '../../model/workbench-dnd.hook';
import type { CatalogueFilter, WorkbenchMode } from '../../model/workbench.types';
import { CataloguePanel } from '../CataloguePanel';
import { InspectorPanel } from '../InspectorPanel';
import { WorkbenchDragOverlay } from '../WorkbenchDragOverlay';
import { WorkbenchWorkspace } from '../WorkbenchWorkspace';

import type { ItemSpot } from '@/domain';
import {
  type Drug,
  useDrugActions,
  useDrugId,
  useDrugs,
} from '@/feature/drug';
import {
  type Implant,
  useImplants,
  useImplantsActions,
  useImplantsState,
} from '@/feature/implant';
import {
  type DamageBonusType,
  type Item,
  useItems,
  useItemsActions,
  useItemsState,
} from '@/feature/item';
import {
  type Kit,
  useKits,
  useKitsActions,
  useKitsOnSpot,
  useKitsState,
} from '@/feature/kit';
import { useBuildPersistence } from '@/feature/persistence';

export const BuildWorkbench = () => {
  const [activeSpot, setActiveSpot] = useState<ItemSpot>('head');
  const [activeMode, setActiveMode] = useState<WorkbenchMode>('equipment');
  const [catalogueFilter, setCatalogueFilter] =
    useState<CatalogueFilter>('equipment');

  const {
    data: allItems,
    isError: hasItemsError,
    isLoading: areItemsLoading,
  } = useItems();
  const {
    data: allKits,
    isError: hasKitsError,
    isLoading: areKitsLoading,
  } = useKits();
  const {
    data: allImplants = [],
    isError: hasImplantsError,
    isLoading: areImplantsLoading,
  } = useImplants();
  const {
    data: allDrugs = [],
    isError: hasDrugsError,
    isLoading: areDrugsLoading,
  } = useDrugs();
  const persistence = useBuildPersistence({ allItems, allKits });

  const items = useItemsState();
  const { setDamageBonus, setItem } = useItemsActions();
  const { kits, techCost } = useKitsOnSpot(activeSpot);
  const kitsBySpot = useKitsState();
  const { addKit, deleteKit, setKitNumber } = useKitsActions();
  const implantLevels = useImplantsState();
  const { decreaseImplant, setImplant } = useImplantsActions();
  const selectedDrugId = useDrugId();
  const { setDrug } = useDrugActions();
  const selectedDrug = selectedDrugId
    ? (allDrugs.find((drug) => drug.id === selectedDrugId) ?? {
        id: selectedDrugId,
        name: 'Drogue inconnue',
        image: '',
        sideEffects: [],
      })
    : null;
  const activeItem = items[activeSpot];
  const selectCatalogueFilter = (filter: CatalogueFilter) => {
    setCatalogueFilter(filter);
    setActiveMode(filter === 'implants' ? 'implants' : 'equipment');
  };

  const selectWorkbenchMode = (mode: WorkbenchMode) => {
    setActiveMode(mode);
    setCatalogueFilter(mode === 'implants' ? 'implants' : 'equipment');
  };

  const openKitPanel = (spot: ItemSpot) => {
    setActiveSpot(spot);
    setActiveMode('equipment');
    setCatalogueFilter('kits');
  };

  const selectEquipmentSpot = (spot: ItemSpot) => {
    setActiveSpot(spot);
    setCatalogueFilter('equipment');
  };

  const equipItem = (item: Item) => {
    setItem(activeSpot, item);
  };

  const installImplant = (implant: Implant) => {
    setImplant(
      implant.name,
      Math.min(implantLevels[implant.name] + 1, implant.levelMax),
    );
  };

  const activateDrug = (drug: Drug) => {
    setDrug(drug.id);
  };

  const deleteSelectedKit = (index: number) => {
    const selectedKit = kits[index];
    if (!selectedKit) return;
    if (selectedKit.number > 1) {
      setKitNumber(activeSpot, index, selectedKit.number - 1);
      return;
    }
    deleteKit(activeSpot, index);
  };

  const {
    accessibility,
    draggedData,
    dragAnnouncement,
    onDragCancel,
    onDragEnd,
    onDragOver,
    onDragStart,
    sensors,
  } = useWorkbenchDnd({
    activeItem,
    addKit,
    decreaseImplant,
    deleteKit,
    implants: implantLevels,
    kits,
    onSpotChange: setActiveSpot,
    setDrug,
    setImplant,
    setItem,
    setKitNumber,
  });

  return (
    <DndContext
      sensors={sensors}
      accessibility={accessibility}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragCancel={onDragCancel}
      onDragEnd={onDragEnd}
    >
      <p className="visuallyHidden" aria-live="polite">
        {dragAnnouncement}
      </p>
      <div className={styles.workbench}>
        <CataloguePanel
          allItems={allItems}
          allKits={allKits}
          allImplants={allImplants}
          allDrugs={allDrugs}
          hasItemsError={hasItemsError}
          hasKitsError={hasKitsError}
          hasImplantsError={hasImplantsError}
          hasDrugsError={hasDrugsError}
          areItemsLoading={areItemsLoading}
          areKitsLoading={areKitsLoading}
          areImplantsLoading={areImplantsLoading}
          areDrugsLoading={areDrugsLoading}
          items={items}
          implantLevels={implantLevels}
          selectedDrugId={selectedDrugId}
          activeItem={activeItem}
          activeSpot={activeSpot}
          activeMode={activeMode}
          catalogueFilter={catalogueFilter}
          onSelectCatalogueFilter={selectCatalogueFilter}
          onSelectWorkbenchMode={selectWorkbenchMode}
          onSelectEquipmentSpot={selectEquipmentSpot}
          onEquip={equipItem}
          onInstallImplant={installImplant}
          onActivateDrug={activateDrug}
          onAddKit={(kit: Kit) => addKit(activeSpot, kit)}
        />
        <WorkbenchWorkspace
          activeMode={activeMode}
          catalogueFilter={catalogueFilter}
          activeSpot={activeSpot}
          activeItem={activeItem}
          items={items}
          kits={kits}
          kitsBySpot={kitsBySpot}
          techCost={techCost}
          allImplants={allImplants}
          implantLevels={implantLevels}
          draggedData={draggedData}
          selectedDrug={selectedDrug}
          onActivateSpot={setActiveSpot}
          onKitOpen={openKitPanel}
          onDamageBonusChange={(spot: ItemSpot, bonus: DamageBonusType) =>
            setDamageBonus(spot, bonus)
          }
          onKitDelete={deleteSelectedKit}
          onImplantRemove={(implant: Implant) =>
            decreaseImplant(implant.name)
          }
          onDrugActivate={() => selectCatalogueFilter('drugs')}
          onDrugClear={() => setDrug(null)}
        />
        <InspectorPanel persistence={persistence} />
      </div>
      <WorkbenchDragOverlay dragData={draggedData} />
    </DndContext>
  );
};

export default BuildWorkbench;
