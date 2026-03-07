import { Field, Radio, RadioGroup } from '@base-ui/react';

import { useProfileActions, useProfileState } from '../../model/profile.store';
import type { Gender } from '../../model/profile.types';
import styles from './GenderSelector.module.css';

export const GenderSelector = () => {
  const { gender } = useProfileState();
  const { setGender } = useProfileActions();

  return (
    <Field.Root>
      <Field.Label>Genre</Field.Label>
      <RadioGroup
        defaultValue="male"
        className={styles.RadioGroup}
        value={gender}
        onValueChange={(value) => setGender(value as Gender)}
      >
        <label className={styles.Item}>
          <Radio.Root value="male" className={styles.Radio}>
            <Radio.Indicator className={styles.Indicator} />
          </Radio.Root>
          Male ♂
        </label>

        <label className={styles.Item}>
          <Radio.Root value="female" className={styles.Radio}>
            <Radio.Indicator className={styles.Indicator} />
          </Radio.Root>
          Femelle ♀
        </label>
      </RadioGroup>
    </Field.Root>
  );
};
