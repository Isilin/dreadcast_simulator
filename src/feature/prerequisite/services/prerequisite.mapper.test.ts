import { describe, expect, it } from 'vitest';

import { toPrerequisites } from './prerequisite.mapper';

describe('toPrerequisites', () => {
  it('maps the stat, title and implant prerequisites', () => {
    expect(
      toPrerequisites({
        stats: [{ property: 'medicine', value: 150 }],
        titles: [{ title_id: 'sentinelle' }],
        implants: [{ implant: { name: 'Génie' } }, { implant: null }],
        races: [{ race: 'Gnoll' }, { race: 'Kobold' }],
      }),
    ).toEqual([
      { kind: 'stat', property: 'medicine', value: 150 },
      { kind: 'title', titleId: 'sentinelle' },
      { kind: 'implant', implant: 'Génie' },
      { kind: 'race', races: ['Gnoll', 'Kobold'] },
    ]);
  });

  it('accepts a payload without title or implant prerequisites', () => {
    expect(
      toPrerequisites({ stats: [{ property: 'agility', value: 50 }] }),
    ).toEqual([{ kind: 'stat', property: 'agility', value: 50 }]);
    expect(toPrerequisites({})).toEqual([]);
  });
});
