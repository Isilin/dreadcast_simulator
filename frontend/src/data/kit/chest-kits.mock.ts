import type { KitResponseDto } from './kit.dto';

export const MOCK_CHEST_KITS: KitResponseDto[] = [
  {
    id: '0',
    name: 'Du Coach',
    tech: 200,
    type: 'chest',
    effects: [
      { property: 'agility', value: -20 },
      { property: 'stealth', value: -20 },
    ],
  },
  {
    id: '1',
    name: 'À capuchon',
    tech: 80,
    type: 'chest',
    effects: [{ property: 'stealth', value: 6 }],
  },
  {
    id: '2',
    name: 'Androïde',
    tech: 0,
    type: 'chest',
    effects: [{ property: 'stamina', value: 20 }],
  },
  {
    id: '3',
    name: 'Bien ajusté',
    tech: 200,
    type: 'chest',
    effects: [
      { property: 'strength', value: 5 },
      {
        property: 'agility',
        value: 15,
      },
      {
        property: 'robustness',
        value: -5,
      },
      {
        property: 'perception',
        value: 5,
      },
    ],
  },
  {
    id: '4',
    name: 'Blindé',
    tech: 250,
    type: 'chest',
    effects: [{ property: 'robustness', value: 16 }],
  },
  {
    id: '5',
    name: 'Chirurgien',
    tech: 160,
    type: 'chest',
    effects: [{ property: 'medicine', value: 12 }],
  },
  {
    id: '6',
    name: 'Combat',
    tech: 70,
    type: 'chest',
    effects: [
      { property: 'strength', value: 4 },
      { property: 'agility', value: -2 },
      { property: 'robustness', value: 4 },
    ],
  },
  {
    id: '7',
    name: 'Concepteur',
    tech: 180,
    type: 'chest',
    effects: [
      { property: 'stamina', value: 20 },
      { property: 'engineering', value: 16 },
    ],
  },
  {
    id: '8',
    name: 'Decker',
    tech: 110,
    type: 'chest',
    effects: [{ property: 'computing', value: 9 }],
  },
  {
    id: '9',
    name: 'Délégué Impérial',
    tech: 330,
    type: 'chest',
    effects: [
      { property: 'agility', value: 12 },
      { property: 'robustness', value: 12 },
      { property: 'perception', value: 12 },
    ],
  },
  {
    id: '10',
    name: 'Des anciens',
    tech: 140,
    type: 'chest',
    effects: [
      { property: 'health', value: 6 },
      { property: 'agility', value: -2 },
      { property: 'robustness', value: 10 },
    ],
  },
  {
    id: '11',
    name: 'Doc',
    tech: 120,
    type: 'chest',
    effects: [
      {
        property: 'medicine',
        value: 7,
      },
      {
        property: 'stamina',
        value: 6,
      },
    ],
  },
  {
    id: '12',
    name: 'Elfique',
    tech: 160,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 3,
      },
      {
        property: 'robustness',
        value: -3,
      },
      {
        property: 'perception',
        value: 17,
      },
    ],
  },
  {
    id: '13',
    name: 'Eugéniste',
    tech: 200,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
      {
        property: 'agility',
        value: 6,
      },
      {
        property: 'robustness',
        value: 6,
      },
      {
        property: 'perception',
        value: 6,
      },
      {
        property: 'stealth',
        value: 6,
      },
      {
        property: 'computing',
        value: 6,
      },
      {
        property: 'medicine',
        value: 6,
      },
      {
        property: 'engineering',
        value: 6,
      },
    ],
  },
  {
    id: '14',
    name: 'Gnoll',
    tech: 0,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
    ],
  },
  {
    id: '15',
    name: 'Gobelin',
    tech: 0,
    type: 'chest',
    effects: [
      {
        property: 'engineering',
        value: 4,
      },
    ],
  },
  {
    id: '16',
    name: 'Haut Dignitaire',
    tech: 320,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 4,
      },
      {
        property: 'perception',
        value: 14,
      },
      {
        property: 'medicine',
        value: 14,
      },
      {
        property: 'health',
        value: 12,
      },
    ],
  },
  {
    id: '17',
    name: 'Impérial',
    tech: 280,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 10,
      },
      {
        property: 'perception',
        value: 10,
      },
      {
        property: 'health',
        value: 8,
      },
    ],
  },
  {
    id: '18',
    name: 'Ingénieur',
    tech: 110,
    type: 'chest',
    effects: [
      {
        property: 'engineering',
        value: 8,
      },
    ],
  },
  {
    id: '19',
    name: 'Journaliste',
    tech: 280,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'robustness',
        value: 5,
      },
      {
        property: 'perception',
        value: 10,
      },
      {
        property: 'health',
        value: 20,
      },
    ],
  },
  {
    id: '20',
    name: 'Kobold',
    tech: 180,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
      {
        property: 'robustness',
        value: -8,
      },
      {
        property: 'stealth',
        value: 18,
      },
    ],
  },
  {
    id: '21',
    name: 'Loyaliste',
    tech: 90,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 8,
      },
      {
        property: 'agility',
        value: 2,
      },
      {
        property: 'robustness',
        value: -2,
      },
    ],
  },
  {
    id: '22',
    name: 'Nain',
    tech: 0,
    type: 'chest',
    effects: [
      {
        property: 'health',
        value: 20,
      },
    ],
  },
  {
    id: '23',
    name: 'Orc',
    tech: 160,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 17,
      },
      {
        property: 'robustness',
        value: 2,
      },
    ],
  },
  {
    id: '24',
    name: 'Outrilien',
    tech: 0,
    type: 'chest',
    effects: [
      {
        property: 'medicine',
        value: 4,
      },
    ],
  },
  {
    id: '25',
    name: 'Police',
    tech: 150,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
      {
        property: 'robustness',
        value: 10,
      },
      {
        property: 'stealth',
        value: -5,
      },
    ],
  },
  {
    id: '26',
    name: 'Souple',
    tech: 90,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'robustness',
        value: -2,
      },
    ],
  },
  {
    id: '27',
    name: 'Troll',
    tech: 340,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 30,
      },
    ],
  },
  {
    id: '28',
    name: 'Vautour',
    tech: 0,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 4,
      },
    ],
  },
  {
    id: '29',
    name: 'Noble',
    tech: 220,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 14,
      },
      {
        property: 'robustness',
        value: -5,
      },
      {
        property: 'perception',
        value: 14,
      },
      {
        property: 'stealth',
        value: -5,
      },
    ],
  },
  {
    id: '30',
    name: 'Paria',
    tech: 120,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: -10,
      },
      {
        property: 'computing',
        value: 10,
      },
      {
        property: 'health',
        value: 5,
      },
      {
        property: 'stamina',
        value: 5,
      },
    ],
  },
  {
    id: '31',
    name: 'Matriciel',
    tech: 160,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 12,
      },
    ],
  },
];
