import { lazy, Suspense, useState } from 'react';

import styles from './InspectorPanel.module.css';
import { ModeTab } from '../ModeTab';
import { UnmetPrerequisitesNotice } from '../UnmetPrerequisitesNotice';

import { ImplantsPanel } from '@/feature/implant';
import { GenderSelector, RaceSelector } from '@/feature/profile';
import { Skills } from '@/feature/stats';
import { TitlesPanel } from '@/feature/title';

// The community entry point is lazy: the Communauté code stays out of the
// workbench chunk until it renders.
const SimilarBuildsButton = lazy(() =>
  import('@/feature/community').then(({ SimilarBuildsButton: Button }) => ({
    default: Button,
  })),
);

type InspectorTab = 'stats' | 'implants' | 'titles';

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
          <ModeTab activeMode={activeTab} mode="titles" onChange={setActiveTab}>
            Titres
          </ModeTab>
        </div>
        <div className={styles.tabPanel} role="tabpanel">
          {activeTab === 'stats' ? (
            <>
              <UnmetPrerequisitesNotice />
              <Skills />
              <Suspense fallback={null}>
                <SimilarBuildsButton />
              </Suspense>
            </>
          ) : null}
          {activeTab === 'implants' ? <ImplantsPanel /> : null}
          {activeTab === 'titles' ? <TitlesPanel /> : null}
        </div>
      </section>
    </aside>
  );
};
