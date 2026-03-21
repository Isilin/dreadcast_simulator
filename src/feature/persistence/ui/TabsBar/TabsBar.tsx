import { Tabs } from '@base-ui/react';
import { useNavigate } from '@tanstack/react-router';

import styles from './TabsBar.module.css';
import { useBuildPersistence } from '../../model';

import { useItems } from '@/feature/item';
import { useKits } from '@/feature/kit';
import Routes from '@/utils/routes';

export const TabsBar = () => {
  const navigate = useNavigate();
  const { data: allItems } = useItems();
  const { data: allKits } = useKits();

  const { active, setActive, builds, slots, storageMode, hasUnlimitedSlots } =
    useBuildPersistence({
      allItems,
      allKits,
    });

  const handleAddSlot = async () => {
    if (storageMode === 'local') {
      await navigate({ to: Routes.connection });
      return;
    }

    if (!hasUnlimitedSlots) {
      await navigate({ to: Routes.subscription });
      return;
    }

    const highestSlot = slots.reduce((highest, slot) => {
      const slotNumber = Number.parseInt(slot, 10);
      if (!Number.isInteger(slotNumber) || slotNumber <= highest) {
        return highest;
      }
      return slotNumber;
    }, 0);

    setActive(String(highestSlot + 1));
  };

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
        <button
          type="button"
          className={styles.addTab}
          onClick={() => void handleAddSlot()}
          aria-label="Ajouter un slot"
          title="Ajouter un slot"
        >
          +
        </button>
      </Tabs.List>
      {slots.map((s) => (
        <Tabs.Panel key={s} value={s} className={styles.panel}>
          {builds[s]?.savedAt ? (
            new Date(builds[s].savedAt!).toLocaleString('fr-FR')
          ) : (
            <span style={{ opacity: 0.5 }}>Vide</span>
          )}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
};

export default TabsBar;
