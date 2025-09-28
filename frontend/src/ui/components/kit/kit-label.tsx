import styles from './kit-label.module.css';

import type { Kit } from '@/domain';
import { EffectChip } from '@/ui/components/effect-chip/effect-chip';
import { TechBadge } from '@/ui/components/tech-badge/tech-badge';

interface Props {
  kit: Kit;
}

export const KitLabel = ({ kit }: Props) => {
  return (
    <div className={styles.container}>
      <TechBadge tech={kit.tech} />
      <span className={styles.name}>{kit.name}</span>
      <div className={styles.effects}>
        {kit.effects?.map((e) => (
          <EffectChip key={e.property} effect={e} />
        ))}
      </div>
    </div>
  );
};
