import type { ItemResponseDto } from './item.dto';

export const MOCK_FEET_ITEMS: ItemResponseDto[] = [
  {
    id: '300',
    name: 'Ballerines',
    image: 'https://wiki.dreadcast.net/images/c/cb/BALLERINES2.png',
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
    image: 'https://wiki.dreadcast.net/images/6/6c/Baskets_lumi_vertes.png',
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
    image: 'https://wiki.dreadcast.net/images/2/2e/Chaussure-squelette.png',
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
    image: 'https://wiki.dreadcast.net/images/b/be/10chaussure_bowling.png',
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
    image: 'https://wiki.dreadcast.net/images/6/6c/11chaussure_dreadball.png',
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
    image: 'https://wiki.dreadcast.net/images/b/bf/Mecano-pied.png',
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
    image: 'https://wiki.dreadcast.net/images/4/4e/Decker-pied.png',
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
    image: 'https://wiki.dreadcast.net/images/b/bf/Medecin-pied.png',
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
      'https://wiki.dreadcast.net/images/8/89/ASSETS_Chaussures_a_talons_262-PX.png',
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
    image: 'https://wiki.dreadcast.net/images/f/fd/Escarpin_Bijela.png',
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
      'https://wiki.dreadcast.net/images/3/32/ASSETS_Bottes-Militaires_262-PX.png',
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
    image: 'https://wiki.dreadcast.net/images/c/cb/BOTTES-A-PIQUES_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/d/db/Bottes-renforcees.png',
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
    image: 'https://wiki.dreadcast.net/images/b/b5/Santiag262.png',
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
    image: 'https://wiki.dreadcast.net/images/b/b8/BOOSTERS_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/1/1c/Chaussettes.png',
    tech: 50,
    integrity: 20,
    type: 'feet',
  },
  {
    id: '316',
    name: 'Leg Warmers',
    image: 'https://wiki.dreadcast.net/images/f/f3/Leg-warmers.png',
    tech: 400,
    integrity: 90,
    type: 'feet',
  },
  {
    id: '317',
    name: 'Bottes AXXXN',
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
    tech: 400,
    integrity: 300,
    type: 'feet',
  },
  {
    id: '320',
    name: 'Bottes AXXXO',
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/5/51/Baskets_lumi_noires.png',
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
    image: 'https://wiki.dreadcast.net/images/2/27/Baskets_lumi_rouges.png',
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
    image: 'https://wiki.dreadcast.net/images/5/55/Baskets_lumi_bleues.png',
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
    image: 'https://wiki.dreadcast.net/images/9/97/CHAUSSURE_VILLE2.png',
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
    image: 'https://wiki.dreadcast.net/images/8/82/Bottes_alpha.png',
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
    image: 'https://wiki.dreadcast.net/images/6/61/Bottes_alpha-ss.png',
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
    image: 'https://wiki.dreadcast.net/images/c/c7/BOTTES_SEXY2.png',
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
    image: 'https://wiki.dreadcast.net/images/6/60/Exosquelette-pied.png',
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
    image: 'https://wiki.dreadcast.net/images/f/ff/ESCARPINS_NOIR_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
    tech: 400,
    integrity: 300,
    type: 'feet',
  },
  {
    id: '332',
    name: 'Bottes A3XXXJ',
    image: 'https://wiki.dreadcast.net/images/7/7a/Bottes_A300.png',
    tech: 400,
    integrity: 300,
    type: 'feet',
  },
];
