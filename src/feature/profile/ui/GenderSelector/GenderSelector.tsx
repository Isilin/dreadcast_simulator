import { useProfileActions, useProfileState } from '../../model/profile.store';
import type { Gender } from '../../model/profile.types';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export const GenderSelector = () => {
  const { gender } = useProfileState();
  const { setGender } = useProfileActions();

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Genre</Label>
      <RadioGroup
        value={gender}
        onValueChange={(value) => setGender(value as Gender)}
        className="flex gap-4"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="male" id="gender-male" />
          <Label htmlFor="gender-male" className="cursor-pointer font-normal">
            Male ♂
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="female" id="gender-female" />
          <Label htmlFor="gender-female" className="cursor-pointer font-normal">
            Femelle ♀
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};
