import { Tabs } from '@base-ui/react';
import { useNavigate } from '@tanstack/react-router';

import styles from './TabsBar.module.css';
import type { BuildPersistenceState } from '../../model/persitence.hook';

import Routes from '@/utils/routes';

interface TabsBarProps {
  persistence: BuildPersistenceState;
}

export const TabsBar = ({ persistence }: TabsBarProps) => {
  const navigate = useNavigate();
  const {
    active,
    setActive,
    builds,
    slots,
    storageMode,
    hasUnlimitedSlots,
    getBuildName,
  } = persistence;

  const handleAddSlot = async () => {
    if (storageMode === 'local') {
      await navigate({ to: Routes.connection });
      return;
    }

    if (!hasUnlimitedSlots) {
      await navigate({ to: Routes.subscription });
      return;
    }

    // Le useMemo ajoute toujours un slot vide en fin de tableau pour les abonnés.
    // Il suffit d'y naviguer pour "créer" le slot suivant.
    const nextEmptySlot = slots[slots.length - 1];
    if (nextEmptySlot) {
      setActive(nextEmptySlot);
    }
  };

  return (
    <Tabs.Root value={active} onValueChange={setActive} className={styles.root}>
      <Tabs.List className={styles.tabList}>
        {slots.map((s) => (
          <Tabs.Tab
            key={s}
            value={s}
            title={getBuildName(s)}
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
