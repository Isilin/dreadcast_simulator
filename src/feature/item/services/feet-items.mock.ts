import type { ItemResponseDto } from './item.dto';

export const MOCK_FEET_ITEMS: ItemResponseDto[] = [
  {
    id: '300',
    name: 'Ballerines',
    image: '/assets/items/BALLERINES2.webp',
    tech: 360,
    integrity: 60,
    type: 'feet',
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '301',
    name: 'Baskets Arika',
    image: '/assets/items/Baskets_lumi_vertes.webp',
    tech: 320,
    integrity: 70,
    type: 'feet',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '302',
    name: 'Chaussure Squelette',
    image: '/assets/items/Chaussure-squelette.webp',
    tech: 400,
    integrity: 60,
    type: 'feet',
    effects: [
      {
        property: 'strength',
        value: 10,
      },
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'robustness',
        value: 5,
      },
      {
        property: 'computing',
        value: 4,
      },
      {
        property: 'medicine',
        value: 12,
      },
      {
        property: 'engineering',
        value: 8,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '303',
    name: 'Chaussures de Bowling',
    image: '/assets/items/10chaussure_bowling.webp',
    tech: 340,
    integrity: 60,
    type: 'feet',
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '304',
    name: 'Chaussures de Dreadball',
    image: '/assets/items/11chaussure_dreadball.webp',
    tech: 400,
    integrity: 100,
    type: 'feet',
    prerequisites: [
      {
        property: 'agility',
        value: 1,
      },
    ],
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '305',
    name: 'Chaussures de Sécurité',
    image: '/assets/items/Mecano-pied.webp',
    tech: 330,
    integrity: 120,
    type: 'feet',
    effects: [
      {
        property: 'engineering',
        value: 8,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '306',
    name: 'Cyber pompes',
    image: '/assets/items/Decker-pied.webp',
    tech: 320,
    integrity: 50,
    type: 'feet',
    effects: [
      {
        property: 'computing',
        value: 7,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '307',
    name: 'Sabots',
    image: '/assets/items/Medecin-pied.webp',
    tech: 320,
    integrity: 45,
    type: 'feet',
    effects: [
      {
        property: 'stealth',
        value: -8,
      },
      {
        property: 'medicine',
        value: 7,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '308',
    name: 'Chaussures à talons',
    image:
      '/assets/items/ASSETS_Chaussures_a_talons_262-PX.webp',
    tech: 340,
    integrity: 60,
    type: 'feet',
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '309',
    name: 'Escarpins Bijela',
    image: '/assets/items/Escarpin_Bijela.webp',
    tech: 360,
    integrity: 75,
    type: 'feet',
    prerequisites: [
      {
        property: 'agility',
        value: 10,
      },
    ],
    effects: [
      {
        property: 'strength',
        value: 4,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '310',
    name: 'Bottes',
    image:
      '/assets/items/ASSETS_Bottes-Militaires_262-PX.webp',
    tech: 330,
    integrity: 100,
    type: 'feet',
    prerequisites: [
      {
        property: 'strength',
        value: 20,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: 7,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '311',
    name: 'Bottes',
    image: '/assets/items/BOTTES-A-PIQUES_262px.webp',
    tech: 360,
    integrity: 90,
    type: 'feet',
    prerequisites: [
      {
        property: 'robustness',
        value: 60,
      },
      {
        property: 'strength',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'strength',
        value: 4,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '312',
    name: 'Bottes renforcées',
    image: '/assets/items/Bottes-renforcees.webp',
    tech: 350,
    integrity: 120,
    type: 'feet',
    prerequisites: [
      {
        property: 'robustness',
        value: 20,
      },
    ],
    effects: [
      {
        property: 'strength',
        value: 5,
      },
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'robustness',
        value: 5,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '313',
    name: 'Santiags',
    image: '/assets/items/Santiag262.webp',
    tech: 400,
    integrity: 140,
    type: 'feet',
    effects: [
      {
        property: 'strength',
        value: 10,
      },
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '314',
    name: 'Boosters',
    image: '/assets/items/BOOSTERS_262px.webp',
    tech: 200,
    integrity: 75,
    type: 'feet',
    prerequisites: [
      {
        property: 'agility',
        value: 120,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -20,
      },
      {
        property: 'stealth',
        value: -30,
      },
      {
        property: 'speed',
        value: 2,
      },
    ],
  },
  {
    id: '315',
    name: 'Chaussettes',
    image: '/assets/items/Chaussettes.webp',
    tech: 50,
    integrity: 20,
    type: 'feet',
  },
  {
    id: '316',
    name: 'Leg Warmers',
    image: '/assets/items/Leg-warmers.webp',
    tech: 400,
    integrity: 90,
    type: 'feet',
  },
  {
    id: '317',
    name: 'Bottes AXXXN',
    image: '/assets/items/Bottes_A300.webp',
    tech: 400,
    integrity: 300,
    type: 'feet',
    effects: [
      {
        property: 'strength',
        value: 10,
      },
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'stealth',
        value: -10,
      },
    ],
  },
  {
    id: '318',
    name: 'Bottes AXXXP',
    image: '/assets/items/Bottes_A300.webp',
    tech: 350,
    integrity: 300,
    type: 'feet',
    effects: [
      {
        property: 'strength',
        value: 5,
      },
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '319',
    name: 'Bottes AXXXT',
    image: '/assets/items/Bottes_A300.webp',
    tech: 400,
    integrity: 300,
    type: 'feet',
  },
  {
    id: '320',
    name: 'Bottes AXXXO',
    image: '/assets/items/Bottes_A300.webp',
    tech: 320,
    integrity: 300,
    type: 'feet',
    effects: [
      {
        property: 'stealth',
        value: -12,
      },
      {
        property: 'medicine',
        value: 12,
      },
    ],
  },
  {
    id: '321',
    name: 'Bottes AXXXD',
    image: '/assets/items/Bottes_A300.webp',
    tech: 320,
    integrity: 300,
    type: 'feet',
    effects: [
      {
        property: 'computing',
        value: 7,
      },
    ],
  },
  {
    id: '322',
    name: 'Baskets Globe',
    image: '/assets/items/Baskets_lumi_noires.webp',
    tech: 320,
    integrity: 70,
    type: 'feet',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '323',
    name: 'Baskets Poumo',
    image: '/assets/items/Baskets_lumi_rouges.webp',
    tech: 320,
    integrity: 70,
    type: 'feet',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '324',
    name: 'Baskets Reezo',
    image: '/assets/items/Baskets_lumi_bleues.webp',
    tech: 320,
    integrity: 70,
    type: 'feet',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '325',
    name: 'Chaussures de ville',
    image: '/assets/items/CHAUSSURE_VILLE2.webp',
    tech: 340,
    integrity: 60,
    type: 'feet',
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '326',
    name: 'Bottes alpha',
    image: '/assets/items/Bottes_alpha.webp',
    tech: 400,
    integrity: 100,
    type: 'feet',
    prerequisites: [
      {
        property: 'agility',
        value: 1,
      },
    ],
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '327',
    name: 'Bottes gamma',
    image: '/assets/items/Bottes_alpha-ss.webp',
    tech: 400,
    integrity: 100,
    type: 'feet',
    prerequisites: [
      {
        property: 'agility',
        value: 1,
      },
    ],
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '328',
    name: 'Bottes à talons',
    image: '/assets/items/BOTTES_SEXY2.webp',
    tech: 400,
    integrity: 100,
    type: 'feet',
    prerequisites: [
      {
        property: 'agility',
        value: 1,
      },
    ],
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '329',
    name: 'Exos pompes de chantiers',
    image: '/assets/items/Exosquelette-pied.webp',
    tech: 330,
    integrity: 120,
    type: 'feet',
    effects: [
      {
        property: 'engineering',
        value: 8,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '330',
    name: 'Escarpins',
    image: '/assets/items/ESCARPINS_NOIR_262px.webp',
    tech: 340,
    integrity: 60,
    type: 'feet',
    effects: [
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '331',
    name: 'Bottes A3XXXL',
    image: '/assets/items/Bottes_A300.webp',
    tech: 400,
    integrity: 300,
    type: 'feet',
  },
  {
    id: '332',
    name: 'Bottes A3XXXJ',
    image: '/assets/items/Bottes_A300.webp',
    tech: 400,
    integrity: 300,
    type: 'feet',
  },
];
