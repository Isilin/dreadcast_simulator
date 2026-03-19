import styles from './TabsBar.module.css';
import { useBuildPersistence } from '../../model';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <Tabs value={active} onValueChange={setActive} className={styles.root}>
      <TabsList className={styles.tabList}>
        {slots.map((s) => (
          <TabsTrigger key={s} value={s} className={styles.tab}>
            {s}
          </TabsTrigger>
        ))}
      </TabsList>
      {slots.map((s) => (
        <TabsContent key={s} value={s} className={styles.panel}>
          {builds[s]?.savedAt ? (
            new Date(builds[s].savedAt!).toLocaleString()
          ) : (
            <span style={{ opacity: 0.5 }}>Empty</span>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabsBar;
