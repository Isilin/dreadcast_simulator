import { Tabs } from '@base-ui/react';

import styles from './TabsBar.module.css';
import { useBuildPersistence } from '../../model';

import { useItems } from '@/feature/item';
import { useKits } from '@/feature/kit';

export const TabsBar = () => {
  const { data: allItems } = useItems();
  const { data: allKits } = useKits();

  const { active, setActive, builds, slots } = useBuildPersistence({
    allItems,
    allKits,
  });

  return (
    <Tabs.Root value={active} onValueChange={setActive} className={styles.root}>
      <Tabs.List className={styles.tabList}>
        {slots.map((s) => (
          <Tabs.Tab
            key={s}
            value={s}
            className={
              active === s
                ? `${styles.tab} ${styles.active}`
                : `${styles.tab} ${styles.inactive}`
            }
          >
            {s}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {slots.map((s) => (
        <Tabs.Panel key={s} value={s} className={styles.panel}>
          {builds[s]?.savedAt ? (
            new Date(builds[s].savedAt!).toLocaleString()
          ) : (
            <span style={{ opacity: 0.5 }}>Empty</span>
          )}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
};

export default TabsBar;
