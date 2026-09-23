import styles from './RemovalDock.module.css';

import type { ItemSpot } from '@/domain';
import { DroppablePanel } from '@/ui/DroppablePanel';

interface RemovalDockProps {
  spot: ItemSpot;
}

export const RemovalDock = ({ spot }: RemovalDockProps) => (
  <DroppablePanel
    id="removal-dock"
    dropData={{ kind: 'removal-dock', spot }}
    title="Zone de retrait"
  >
    <p className={styles.label}>Déposer ici pour retirer</p>
  </DroppablePanel>
);
