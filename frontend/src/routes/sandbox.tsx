import { createFileRoute } from '@tanstack/react-router';

import { GenderSelector } from '@/ui/components/gender/gender-selector';
import { Implants } from '@/ui/components/implant/implants';
import { ItemSelector } from '@/ui/components/item/item-selector';
import { RaceSelector } from '@/ui/components/race/race-selector';
import { Silhouette } from '@/ui/components/silhouette/silhouette';
import { Skills } from '@/ui/components/stats/skills';

export const Route = createFileRoute('/sandbox')({
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
        <Implants />
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
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <ItemSelector type="head" />
            <ItemSelector type="chest" />
            <ItemSelector type="legs" />
            <ItemSelector type="feet" />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '16px',
            }}
          >
            <ItemSelector type="left_arm" />
            <ItemSelector type="right_arm" />
            <ItemSelector type="secondary" />
          </div>
        </div>
        <Silhouette />
      </div>
    </div>
  );
}
