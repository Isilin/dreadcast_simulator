import { Tabs } from '@base-ui-components/react';

import styles from './TabsBar.module.css';

export interface TabsBarProps {
  active: string;
  setActive: (value: string) => void;
  slots: string[];
  builds: Record<string, { savedAt?: number }>;
}

export const TabsBar = ({ active, setActive, slots, builds }: TabsBarProps) => {
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
