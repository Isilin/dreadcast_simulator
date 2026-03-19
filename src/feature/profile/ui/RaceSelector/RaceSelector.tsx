import { useProfileActions, useProfileState } from '../../model/profile.store';
import type { RaceType } from '../../model/profile.types';
import { useRaces } from '../../services';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const RaceSelector = () => {
  const { race } = useProfileState();
  const { setRace } = useProfileActions();
  const { data: races, status } = useRaces();

  const handleChange = (value: string) => {
    const found = races?.find((r) => r.type === value);
    if (found) setRace(found.type as RaceType);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Race</Label>
      <Select
        value={race || 'Humain'}
        onValueChange={handleChange}
        disabled={status === 'pending'}
      >
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {races?.map((r) => (
            <SelectItem key={r.type} value={r.type}>
              {r.type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
