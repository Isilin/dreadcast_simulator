import type { Kit } from '../../model/kit.types';

import { PrerequisiteWarning } from '@/feature/prerequisite';
import { CatalogueModule } from '@/ui/CatalogueModule';
import { StatEffects } from '@/ui/StatEffects';

interface CatalogueKitModuleProps {
  kit: Kit;
  disabled?: boolean;
  /** False shows a red warning with the missing prerequisites. */
  prerequisitesMet?: boolean;
  onAdd: () => void;
}

export const CatalogueKitModule = ({
  kit,
  disabled = false,
  prerequisitesMet = true,
  onAdd,
}: CatalogueKitModuleProps) => (
  <CatalogueModule
    id={`module-kit-catalogue-${kit.id}`}
    dragData={{ kind: 'kit', kit }}
    name={kit.name}
    detail={`Tech ${kit.tech}`}
    onClick={onAdd}
    disabled={disabled}
    alert={
      prerequisitesMet ? null : (
        <PrerequisiteWarning prerequisites={kit.prerequisites} />
      )
    }
  >
    <StatEffects effects={kit.effects} />
  </CatalogueModule>
);
