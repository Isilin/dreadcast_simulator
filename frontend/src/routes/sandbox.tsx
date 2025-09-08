import { createFileRoute } from '@tanstack/react-router';

import { GenderSelector } from '@/ui/components/gender/gender-selector';
import { Implants } from '@/ui/components/implant/implants';
import { ItemSelector } from '@/ui/components/item/item-selector';
import { KitSelector } from '@/ui/components/kit/kit-selector';
import { RaceSelector } from '@/ui/components/race/race-selector';
import { Silhouette } from '@/ui/components/silhouette/silhouette';
import { Skills } from '@/ui/components/stats/skills';

export const Route = createFileRoute('/sandbox')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <ItemSelector type="head" />
            <KitSelector type="head" />
          </div>
          <ItemSelector type="chest" />
          <ItemSelector type="legs" />
          <ItemSelector type="feet" />
          <ItemSelector type="secondary" />
        </div>
        <Silhouette />
      </div>
    </div>
  );
}
