import type { Drug } from '../../model/drug.types';

import { CatalogueModule } from '@/ui/CatalogueModule';
import { StatEffects } from '@/ui/StatEffects';

interface CatalogueDrugModuleProps {
  drug: Drug;
  isActive: boolean;
  onActivate: () => void;
}

export const CatalogueDrugModule = ({
  drug,
  isActive,
  onActivate,
}: CatalogueDrugModuleProps) => (
  <CatalogueModule
    id={`module-drug-catalogue-${drug.id}`}
    dragData={{ kind: 'drug', drug }}
    name={drug.name}
    detail={isActive ? 'Active' : 'Disponible'}
    image={drug.image}
    onClick={onActivate}
  >
    <StatEffects effects={drug.sideEffects} inline />
  </CatalogueModule>
);
