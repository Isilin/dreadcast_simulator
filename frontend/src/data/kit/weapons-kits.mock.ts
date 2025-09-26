import type { KitResponseDto } from './kit.dto';

export const MOCK_WEAPONS_KITS: KitResponseDto[] = [
  {
    id: '500',
    name: "D'entrainement",
    tech: 100,
    type: '1handMelee',
    effects: [
      {
        property: 'agility',
        value: 20,
      },
      {
        property: 'robustness',
        value: -40,
      },
    ],
  },
  {
    id: '501',
    name: 'De facture impériale',
    tech: 320,
    type: '1handMelee',
    effects: [
      {
        property: 'strength',
        value: -4,
      },
      {
        property: 'agility',
        value: 11,
      },
    ],
  },
  {
    id: '502',
    name: 'De facture naine',
    tech: 240,
    type: '1handMelee',
    effects: [
      {
        property: 'strength',
        value: 7,
      },
      {
        property: 'agility',
        value: 7,
      },
    ],
  },
  {
    id: '503',
    name: 'En carbone',
    tech: 80,
    type: '1handMelee',
    effects: [],
  },
  {
    id: '504',
    name: 'Équilibré',
    tech: 120,
    type: '1handMelee',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '505',
    name: 'Imposant',
    tech: 240,
    type: '1handMelee',
    effects: [
      {
        property: 'strength',
        value: 12,
      },
      {
        property: 'agility',
        value: -5,
      },
    ],
  },
  {
    id: '506',
    name: 'Orc',
    tech: 225,
    type: '1handMelee',
    effects: [
      {
        property: 'strength',
        value: 13,
      },
      {
        property: 'agility',
        value: 4,
      },
    ],
  },
  {
    id: '507',
    name: 'Rasoir',
    tech: 80,
    type: '1handMelee',
    effects: [],
  },
  {
    id: '508',
    name: 'Allégé',
    tech: 125,
    type: '2handsMelee',
    effects: [
      {
        property: 'agility',
        value: 17,
      },
    ],
  },
  {
    id: '509',
    name: 'Bricolé',
    tech: 80,
    type: '2handsMelee',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '510',
    name: "D'entrainement",
    tech: 100,
    type: '2handsMelee',
    effects: [
      {
        property: 'agility',
        value: 40,
      },
      {
        property: 'robustness',
        value: -80,
      },
    ],
  },
  {
    id: '511',
    name: 'Elfique',
    tech: 0,
    type: '2handsMelee',
    effects: [
      {
        property: 'perception',
        value: 6,
      },
    ],
  },
  {
    id: '512',
    name: 'Forgé en apesanteur',
    tech: 240,
    type: '2handsMelee',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '513',
    name: 'Gros',
    tech: 60,
    type: '2handsMelee',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
      {
        property: 'agility',
        value: -1,
      },
    ],
  },
  {
    id: '514',
    name: 'Orc',
    tech: 122,
    type: '2handsMelee',
    effects: [
      {
        property: 'strength',
        value: 10,
      },
      {
        property: 'agility',
        value: -5,
      },
    ],
  },
  {
    id: '515',
    name: 'Rétropropulsé',
    tech: 178,
    type: '2handsMelee',
    effects: [
      {
        property: 'strength',
        value: 10,
      },
      {
        property: 'agility',
        value: 5,
      },
    ],
  },
  {
    id: '516',
    name: 'Tranchant',
    tech: 100,
    type: '2handsMelee',
    effects: [],
  },
  {
    id: '517',
    name: 'Trempé',
    tech: 50,
    type: '2handsMelee',
    effects: [],
  },
  {
    id: '518',
    name: 'À chargeur rotatif',
    tech: 80,
    type: '1handShot',
    effects: [],
  },
  {
    id: '519',
    name: 'Avec pointeur laser',
    tech: 140,
    type: '1handShot',
    effects: [
      {
        property: 'agility',
        value: 3,
      },
      {
        property: 'perception',
        value: 4,
      },
    ],
  },
  {
    id: '520',
    name: 'Bullpup',
    tech: 80,
    type: '1handShot',
    effects: [],
  },
  {
    id: '521',
    name: "D'entrainement",
    tech: 100,
    type: '1handShot',
    effects: [
      {
        property: 'agility',
        value: 20,
      },
      {
        property: 'robustness',
        value: -40,
      },
    ],
  },
  {
    id: '522',
    name: 'De facture impériale',
    tech: 320,
    type: '1handShot',
    effects: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'perception',
        value: -2,
      },
    ],
  },
  {
    id: '523',
    name: 'Elfique',
    tech: 0,
    type: '1handShot',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
      {
        property: 'perception',
        value: 9,
      },
    ],
  },
  {
    id: '524',
    name: 'Interfacé',
    tech: 240,
    type: '1handShot',
    effects: [
      {
        property: 'perception',
        value: 6,
      },
    ],
  },
  {
    id: '525',
    name: 'Léger',
    tech: 140,
    type: '1handShot',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
      {
        property: 'perception',
        value: 5,
      },
    ],
  },
  {
    id: '526',
    name: 'Long',
    tech: 100,
    type: '1handShot',
    effects: [
      {
        property: 'agility',
        value: -9,
      },
    ],
  },
  {
    id: '527',
    name: 'Résistant',
    tech: 60,
    type: '1handShot',
    effects: [],
  },
  {
    id: '528',
    name: 'À crosse coupée',
    tech: 80,
    type: '2handsShot',
    effects: [
      {
        property: 'agility',
        value: 8,
      },
    ],
  },
  {
    id: '529',
    name: 'À lunette',
    tech: 120,
    type: '2handsShot',
    effects: [
      {
        property: 'agility',
        value: 3,
      },
      {
        property: 'perception',
        value: 9,
      },
    ],
  },
  {
    id: '530',
    name: 'Avec chargeur à bande',
    tech: 80,
    type: '2handsShot',
    effects: [],
  },
  {
    id: '531',
    name: 'Avec chargeur couplé',
    tech: 40,
    type: '2handsShot',
    effects: [],
  },
  {
    id: '532',
    name: 'Avec correcteur de visée',
    tech: 180,
    type: '2handsShot',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
      {
        property: 'perception',
        value: 5,
      },
    ],
  },
  {
    id: '533',
    name: "D'entrainement",
    tech: 100,
    type: '2handsShot',
    effects: [
      {
        property: 'agility',
        value: 40,
      },
      {
        property: 'robustness',
        value: -80,
      },
    ],
  },
  {
    id: '534',
    name: 'De bonne facture',
    tech: 200,
    type: '2handsShot',
    effects: [],
  },
  {
    id: '535',
    name: 'Éclairant',
    tech: 60,
    type: '2handsShot',
    effects: [
      {
        property: 'perception',
        value: 5,
      },
    ],
  },
  {
    id: '536',
    name: 'Elfique',
    tech: 240,
    type: '2handsShot',
    effects: [
      {
        property: 'agility',
        value: 3,
      },
      {
        property: 'perception',
        value: 20,
      },
    ],
  },
  {
    id: '537',
    name: 'En titane',
    tech: 100,
    type: '2handsShot',
    effects: [
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'perception',
        value: 8,
      },
    ],
  },
  {
    id: '538',
    name: 'Renforcé',
    tech: 60,
    type: '2handsShot',
    effects: [],
  },
  {
    id: '539',
    name: 'À canon lourd',
    tech: 140,
    type: '2handsShot',
    effects: [
      {
        property: 'perception',
        value: -10,
      },
    ],
  },
];
