import type { Implant } from '../../model/implant.types';

import { CatalogueModule } from '@/ui/CatalogueModule';

interface CatalogueImplantModuleProps {
  implant: Implant;
  level: number;
  onInstall: () => void;
}

export const CatalogueImplantModule = ({
  implant,
  level,
  onInstall,
}: CatalogueImplantModuleProps) => (
  <CatalogueModule
    id={`module-implant-catalogue-${implant.id}`}
    dragData={{ kind: 'implant', implant, source: 'catalogue' }}
    name={implant.name}
    detail={`Niveau ${level}/${implant.levelMax}`}
    onClick={onInstall}
  />
);
