import { lazy, Suspense } from 'react';

import styles from './InspectorPanel.module.css';

import {
  BuildNameEditor,
  IconBar,
  TabsBar,
} from '@/feature/persistence';
import type { useBuildPersistence } from '@/feature/persistence';
import { GenderSelector, RaceSelector } from '@/feature/profile';
import { Skills } from '@/feature/stats';

// Community entry points are lazy: the Communauté code stays out of the
// workbench chunk until they render.
const PublishBuildButton = lazy(() =>
  import('@/feature/community').then(({ PublishBuildButton: Button }) => ({
    default: Button,
  })),
);
const SimilarBuildsButton = lazy(() =>
  import('@/feature/community').then(({ SimilarBuildsButton: Button }) => ({
    default: Button,
  })),
);

type BuildPersistence = ReturnType<typeof useBuildPersistence>;

interface InspectorPanelProps {
  persistence: BuildPersistence;
}

export const InspectorPanel = ({ persistence }: InspectorPanelProps) => (
  <aside className={styles.inspector} aria-label="Inspecteur du build">
    <section className={styles.section}>
      <p className={styles.eyebrow}>Sauvegardes</p>
      <BuildNameEditor persistence={persistence} />
      <Suspense fallback={null}>
        <PublishBuildButton persistence={persistence} />
      </Suspense>
      <TabsBar persistence={persistence} />
    </section>
    <section className={styles.section}>
      <p className={styles.eyebrow}>Statistiques</p>
      <Skills />
      <Suspense fallback={null}>
        <SimilarBuildsButton />
      </Suspense>
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
