import styles from './CataloguePanel.module.css';
import {
  type CatalogueFilter,
  workbenchSlotLabels,
} from '../../model/workbench.types';

import type { ItemSpot } from '@/domain';
import {
  CatalogueDrugModule,
  type Drug,
} from '@/feature/drug';
import {
  CatalogueImplantModule,
  type Implant,
  type ImplantsState,
} from '@/feature/implant';
import {
  CatalogueItem,
  type Item,
} from '@/feature/item';
import { CatalogueKitModule, type Kit } from '@/feature/kit';

interface CatalogueGridProps {
  activeItem: Item | null;
  activeSpot: ItemSpot;
  catalogueCount: number;
  catalogueFilter: CatalogueFilter;
  isCatalogueLoading: boolean;
  isCatalogueUnavailable: boolean;
  implantLevels: ImplantsState;
  selectedDrugId: string | null;
  visibleDrugs: Drug[];
  visibleImplants: Implant[];
  visibleItems: Item[];
  visibleKits: Kit[];
  onActivateDrug: (drug: Drug) => void;
  onAddKit: (kit: Kit) => void;
  onEquip: (item: Item) => void;
  onInstallImplant: (implant: Implant) => void;
}

export const CatalogueGrid = ({
  activeItem,
  activeSpot,
  catalogueCount,
  catalogueFilter,
  isCatalogueLoading,
  isCatalogueUnavailable,
  implantLevels,
  selectedDrugId,
  visibleDrugs,
  visibleImplants,
  visibleItems,
  visibleKits,
  onActivateDrug,
  onAddKit,
  onEquip,
  onInstallImplant,
}: CatalogueGridProps) => (
  <div className={styles.grid}>
    {catalogueFilter === 'equipment'
      ? visibleItems.map((item) => (
          <CatalogueItem
            key={item.id}
            item={item}
            spotLabel={workbenchSlotLabels[activeSpot]}
            onEquip={onEquip}
          />
        ))
      : null}
    {catalogueFilter === 'implants'
      ? visibleImplants.map((implant) => (
          <CatalogueImplantModule
            key={implant.id}
            implant={implant}
            level={implantLevels[implant.name]}
            onInstall={() => onInstallImplant(implant)}
          />
        ))
      : null}
    {catalogueFilter === 'drugs'
      ? visibleDrugs.map((drug) => (
          <CatalogueDrugModule
            key={drug.id}
            drug={drug}
            isActive={selectedDrugId === drug.id}
            onActivate={() => onActivateDrug(drug)}
          />
        ))
      : null}
    {catalogueFilter === 'kits'
      ? visibleKits.map((kit) => (
          <CatalogueKitModule
            key={kit.id}
            kit={kit}
            onAdd={() => onAddKit(kit)}
            disabled={!activeItem}
          />
        ))
      : null}
    {isCatalogueLoading ? (
      <p className={styles.emptyState}>Chargement du catalogue...</p>
    ) : null}
    {isCatalogueUnavailable ? (
      <p className={styles.error} role="alert">
        Catalogue indisponible. Réessayez après le rétablissement du service de
        données.
      </p>
    ) : null}
    {!isCatalogueLoading && !isCatalogueUnavailable && catalogueCount === 0 ? (
      <p className={styles.emptyState}>
        Aucun élément ne correspond à ce filtre.
      </p>
    ) : null}
  </div>
);
