import type { Kit } from '../../model/kit.types';
import { KitEffects } from '../KitEffects';

import { CatalogueModule } from '@/ui/CatalogueModule';

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
    <KitEffects effects={kit.effects} />
  </CatalogueModule>
);
