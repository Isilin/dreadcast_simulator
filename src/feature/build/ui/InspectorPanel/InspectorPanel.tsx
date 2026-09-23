import { lazy, Suspense, useState } from 'react';

import styles from './InspectorPanel.module.css';
import { ModeTab } from '../ModeTab';

import { ImplantsPanel } from '@/feature/implant';
import { GenderSelector, RaceSelector } from '@/feature/profile';
import { Skills } from '@/feature/stats';

// The community entry point is lazy: the Communauté code stays out of the
// workbench chunk until it renders.
const SimilarBuildsButton = lazy(() =>
  import('@/feature/community').then(({ SimilarBuildsButton: Button }) => ({
    default: Button,
  })),
);

type InspectorTab = 'stats' | 'implants';

export const InspectorPanel = () => {
  const [activeTab, setActiveTab] = useState<InspectorTab>('stats');

  return (
    <aside className={styles.inspector} aria-label="Inspecteur du build">
      <section className={styles.section}>
        <p className={styles.eyebrow}>Profil</p>
        <div className={styles.profileControls}>
          <GenderSelector />
          <RaceSelector />
        </div>
      </section>
      <section className={styles.tabsSection}>
        <div className={styles.tabs} role="tablist" aria-label="Détails du build">
          <ModeTab activeMode={activeTab} mode="stats" onChange={setActiveTab}>
            Statistiques
          </ModeTab>
          <ModeTab
            activeMode={activeTab}
            mode="implants"
            onChange={setActiveTab}
          >
            Implants
          </ModeTab>
        </div>
        <div className={styles.tabPanel} role="tabpanel">
          {activeTab === 'stats' ? (
            <>
              <Skills />
              <Suspense fallback={null}>
                <SimilarBuildsButton />
              </Suspense>
            </>
          ) : (
            <ImplantsPanel />
          )}
        </div>
      </section>
    </aside>
  );
};
