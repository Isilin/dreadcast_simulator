import { Tabs } from '@base-ui-components/react';

import styles from './TabsBar.module.css';

import { useImplantsDispatch, useImplantsState } from '@/feature/implant';
import { useItemsDispatch, useItemsState } from '@/feature/item';
import { useKitsDispatch, useKitsState } from '@/feature/kit';
import { useBuildPersistence } from '@/feature/persistence/model/persitence.hook';
import { useProfileDispatch, useProfileState } from '@/feature/profile';

export const TabsBar = () => {
  const profile = useProfileState();
  const profileDispatch = useProfileDispatch();
  const implants = useImplantsState();
  const implantsDispatch = useImplantsDispatch();
  const items = useItemsState();
  const itemsDispatch = useItemsDispatch();
  const kits = useKitsState();
  const kitsDispatch = useKitsDispatch();

  const { active, setActive, builds, slots } = useBuildPersistence({
    profile,
    implants,
    items,
    kits,
    profileDispatch,
    implantsDispatch,
    itemsDispatch,
    kitsDispatch,
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
