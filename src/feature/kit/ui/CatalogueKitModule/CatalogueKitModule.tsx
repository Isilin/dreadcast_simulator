import type { Kit } from '../../model/kit.types';

import { CatalogueModule } from '@/ui/CatalogueModule';
import { StatEffects } from '@/ui/StatEffects';

interface CatalogueKitModuleProps {
  kit: Kit;
  disabled?: boolean;
  onAdd: () => void;
}

export const CatalogueKitModule = ({
  kit,
  disabled = false,
  onAdd,
}: CatalogueKitModuleProps) => (
  <CatalogueModule
    id={`module-kit-catalogue-${kit.id}`}
    dragData={{ kind: 'kit', kit }}
    name={kit.name}
    detail={`Tech ${kit.tech}`}
    onClick={onAdd}
    disabled={disabled}
  >
    <StatEffects effects={kit.effects} />
  </CatalogueModule>
);
