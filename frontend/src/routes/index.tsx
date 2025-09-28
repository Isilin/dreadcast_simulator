import { createFileRoute } from '@tanstack/react-router';

import { GenderSelector } from '@/feature/gender/gender-selector';
import { ImplantsButton } from '@/feature/implant/implants-button.tsx';
import { ItemSelector } from '@/feature/item/item-selector';
import { KitSelector } from '@/feature/kit/kit-selector';
import { RaceSelector } from '@/feature/race/race-selector';
import { Silhouette } from '@/feature/race/silhouette';
import { Skills } from '@/feature/stats/skills';

import './App.css';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8rem' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: '0 0 auto',
          minWidth: '120px',
        }}
      >
        <GenderSelector />
        <RaceSelector />
        <Skills />
        <ImplantsButton />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: '1 1 auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <ItemSelector spot="head" />
              <ItemSelector spot="chest" />
              <ItemSelector spot="legs" />
              <ItemSelector spot="feet" />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <KitSelector spot="head" />
              <KitSelector spot="chest" />
              <KitSelector spot="legs" />
              <KitSelector spot="feet" />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '16px',
              }}
            >
              <KitSelector spot="leftArm" />
              <KitSelector spot="rightArm" />
              <KitSelector spot="secondary" />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '16px',
              }}
            >
              <ItemSelector spot="leftArm" />
              <ItemSelector spot="rightArm" />
              <ItemSelector spot="secondary" />
            </div>
          </div>
        </div>
        <Silhouette />
      </div>
    </div>
  );
}
