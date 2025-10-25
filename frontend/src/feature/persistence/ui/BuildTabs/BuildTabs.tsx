import { IconBar } from '../IconBar';
import { TabsBar } from '../TabsBar';
import styles from './BuildTabs.module.css';

import { useImplantsDispatch, useImplantsState } from '@/feature/implant';
import { useItemsDispatch, useItemsState } from '@/feature/item';
import { useKitsDispatch, useKitsState } from '@/feature/kit';
import { useBuildPersistence } from '@/feature/persistence/model/persitence.hook';
import { usePRofileDispatch, useProfileState } from '@/feature/profile';

// subcomponents moved to ./IconBar and ./TabsBar

export const BuildTabs = () => {
  const profile = useProfileState();
  const profileDispatch = usePRofileDispatch();
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
    <div className={styles.container}>
      <IconBar />
      <TabsBar
        active={active}
        setActive={setActive}
        slots={slots}
        builds={builds}
      />
    </div>
  );
};

export default BuildTabs;
