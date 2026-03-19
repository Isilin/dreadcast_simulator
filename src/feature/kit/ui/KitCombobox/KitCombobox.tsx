import { useKits, type Kit } from '../..';
import { KitLabel } from '../KitLabel';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ItemType } from '@/feature/item';

interface Props {
  type: ItemType[];
  kit: Kit;
  onChange: (kit: Kit | null) => void;
}

export const KitCombobox = ({ type, kit, onChange }: Props) => {
  const { data } = useKits(type);

  const handleValueChange = (value: string) => {
    const found = data?.find((k) => String(k.id) === value) ?? null;
    onChange(found);
  };

  return (
    <Select value={String(kit.id)} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <KitLabel kit={kit} />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {data?.map((k) => (
          <SelectItem key={k.id} value={String(k.id)}>
            <KitLabel kit={k} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
