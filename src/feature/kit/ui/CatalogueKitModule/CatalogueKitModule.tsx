import type { Kit } from '../../model/kit.types';

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
    dragData={{ kind: 'kit', kit, source: 'catalogue' }}
    name={kit.name}
    detail={`Tech ${kit.tech}`}
    onClick={onAdd}
    disabled={disabled}
  />
);
