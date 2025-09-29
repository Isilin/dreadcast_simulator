import styles from './kit-label.module.css';

import { getTagFromProperty, type Kit } from '@/domain';
import { EffectChip } from '@/ui/effect-chip';
import { TechBadge } from '@/ui/tech-badge';

interface Props {
  kit: Kit;
}

export const KitLabel = ({ kit }: Props) => {
  return (
    <div className={styles.container}>
      <TechBadge value={kit.tech} />
      <span className={styles.name}>{kit.name}</span>
      <div className={styles.effects}>
        {kit.effects?.map((e) => (
          <EffectChip
            key={e.property}
            value={e.value}
            label={getTagFromProperty(e.property)}
          />
        ))}
      </div>
    </div>
  );
};
