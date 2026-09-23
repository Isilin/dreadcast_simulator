import { DndContext } from '@dnd-kit/core';
import { useState } from 'react';

import styles from './BuildWorkbench.module.css';
import { useWorkbenchDnd } from '../../model/workbench-dnd.hook';
import type {
  CatalogueFilter,
  CatalogueTab,
} from '../../model/workbench.types';
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
import { TabsBar, useBuildPersistence } from '@/feature/persistence';
import { AppFooterPortal } from '@/ui';

interface BuildWorkbenchProps {
  /** Slot to open first (e.g. a build copied from the Communauté). */
  initialSlot?: number;
}

export const BuildWorkbench = ({ initialSlot }: BuildWorkbenchProps = {}) => {
  const [activeSpot, setActiveSpot] = useState<ItemSpot>('head');
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
    data: allDrugs = [],
    isError: hasDrugsError,
    isLoading: areDrugsLoading,
  } = useDrugs();
  const persistence = useBuildPersistence({ allItems, allKits, initialSlot });

  const items = useItemsState();
  const { setDamageBonus, setItem } = useItemsActions();
  const { kits } = useKitsOnSpot(activeSpot);
  const kitsBySpot = useKitsState();
  const { addKit, deleteKit, setKitNumber } = useKitsActions();
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
  const selectCatalogueTab = (tab: CatalogueTab) => {
    setCatalogueFilter(tab);
  };

  const openKitPanel = (spot: ItemSpot) => {
    setActiveSpot(spot);
    setCatalogueFilter('kits');
  };

  const selectEquipmentSpot = (spot: ItemSpot) => {
    setActiveSpot(spot);
    setCatalogueFilter('equipment');
  };

  const equipItem = (item: Item) => {
    setItem(activeSpot, item);
  };

  const activateDrug = (drug: Drug) => {
    setDrug(drug.id);
  };

  const changeKitNumber = (index: number, delta: number) => {
    const selectedKit = kits[index];
    if (!selectedKit) return;
    setKitNumber(
      activeSpot,
      index,
      Math.max(1, selectedKit.number + delta),
    );
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
    onSpotChange: setActiveSpot,
    setDrug,
    setItem,
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
          allDrugs={allDrugs}
          hasItemsError={hasItemsError}
          hasKitsError={hasKitsError}
          hasDrugsError={hasDrugsError}
          areItemsLoading={areItemsLoading}
          areKitsLoading={areKitsLoading}
          areDrugsLoading={areDrugsLoading}
          items={items}
          selectedDrugId={selectedDrugId}
          activeItem={activeItem}
          activeSpot={activeSpot}
          catalogueFilter={catalogueFilter}
          onSelectCatalogueTab={selectCatalogueTab}
          onSelectEquipmentSpot={selectEquipmentSpot}
          onEquip={equipItem}
          onActivateDrug={activateDrug}
          onAddKit={(kit: Kit) => addKit(activeSpot, kit)}
        />
        <WorkbenchWorkspace
          persistence={persistence}
          catalogueFilter={catalogueFilter}
          activeSpot={activeSpot}
          activeItem={activeItem}
          items={items}
          kits={kits}
          kitsBySpot={kitsBySpot}
          draggedData={draggedData}
          selectedDrug={selectedDrug}
          onActivateSpot={setActiveSpot}
          onKitOpen={openKitPanel}
          onKitClose={() => setCatalogueFilter('equipment')}
          onDamageBonusChange={(spot: ItemSpot, bonus: DamageBonusType) =>
            setDamageBonus(spot, bonus)
          }
          onKitIncrease={(index: number) => changeKitNumber(index, 1)}
          onKitDecrease={(index: number) => changeKitNumber(index, -1)}
          onKitDelete={(index: number) => deleteKit(activeSpot, index)}
          onDrugActivate={() => selectCatalogueTab('drugs')}
          onDrugClear={() => setDrug(null)}
        />
        <InspectorPanel />
      </div>
      <WorkbenchDragOverlay dragData={draggedData} />
      <AppFooterPortal>
        <TabsBar persistence={persistence} />
      </AppFooterPortal>
    </DndContext>
  );
};

export default BuildWorkbench;
