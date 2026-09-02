import styles from './InspectorPanel.module.css';

import {
  BuildNameEditor,
  IconBar,
  TabsBar,
} from '@/feature/persistence';
import type { useBuildPersistence } from '@/feature/persistence';
import { GenderSelector, RaceSelector } from '@/feature/profile';
import { Skills } from '@/feature/stats';

type BuildPersistence = ReturnType<typeof useBuildPersistence>;

interface InspectorPanelProps {
  persistence: BuildPersistence;
}

export const InspectorPanel = ({ persistence }: InspectorPanelProps) => (
  <aside className={styles.inspector} aria-label="Inspecteur du build">
    <section className={styles.section}>
      <p className={styles.eyebrow}>Sauvegardes</p>
      <BuildNameEditor persistence={persistence} />
      <TabsBar persistence={persistence} />
    </section>
    <section className={styles.section}>
      <p className={styles.eyebrow}>Statistiques</p>
      <Skills />
    </section>
    <section className={styles.section}>
      <p className={styles.eyebrow}>Profil et modules</p>
      <div className={styles.profileControls}>
        <GenderSelector />
        <RaceSelector />
      </div>
    </section>
    <div className={styles.links}>
      <IconBar />
    </div>
  </aside>
);
