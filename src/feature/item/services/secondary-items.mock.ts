import type { ItemResponseDto } from './item.dto';

export const MOCK_SECONDARY_ITEMS: ItemResponseDto[] = [
  {
    id: '400',
    name: 'Anneau Imperial',
    image: '/assets/items/Anneau_imperial.webp',
    tech: 0,
    integrity: 600,
    type: 'secondary',
  },
  {
    id: '401',
    name: 'Bague saphir pourpre',
    image: '/assets/items/Bague_saphir_pourpre.webp',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '402',
    name: 'Boite à outils',
    image: '/assets/items/Boite_a_outils.webp',
    tech: 0,
    integrity: 70,
    type: 'secondary',
    effects: [
      {
        property: 'engineering',
        value: 21,
      },
    ],
  },
  {
    id: '403',
    name: 'Bracelet',
    image: '/assets/items/Bracelet.webp',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '404',
    name: 'Ceinture',
    image: '/assets/items/Ceinture.webp',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '405',
    name: 'Ceinture titane',
    image: '/assets/items/Ceinture_titane.webp',
    tech: 400,
    integrity: 100,
    type: 'secondary',
  },
  {
    id: '406',
    name: 'Chaîne',
    image: '/assets/items/Chaine.webp',
    tech: 300,
    integrity: 80,
    type: 'secondary',
    prerequisites: [
      {
        property: 'strength',
        value: 90,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -2,
      },
      {
        property: 'robustness',
        value: 10,
      },
    ],
  },
  {
    id: '407',
    name: 'Cibleur',
    image: '/assets/items/Cibleur.webp',
    tech: 240,
    integrity: 30,
    type: 'secondary',
    effects: [
      {
        property: 'perception',
        value: 20,
      },
      {
        property: 'computing',
        value: 10,
      },
      {
        property: 'engineering',
        value: 10,
      },
    ],
  },
  {
    id: '408',
    name: 'Collier en cuir',
    image: '/assets/items/Collier_en_cuir.webp',
    tech: 300,
    integrity: 80,
    type: 'secondary',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -2,
      },
      {
        property: 'robustness',
        value: 10,
      },
    ],
  },
  {
    id: '409',
    name: "Collier tech'",
    image: '/assets/items/Collier_tech.webp',
    tech: 330,
    integrity: 120,
    type: 'secondary',
    prerequisites: [
      {
        property: 'computing',
        value: 150,
      },
    ],
    effects: [
      {
        property: 'computing',
        value: 15,
      },
      {
        property: 'engineering',
        value: 7,
      },
    ],
  },
  {
    id: '410',
    name: 'Pendentif Cristal',
    image: '/assets/items/Cravate.webp',
    tech: 360,
    integrity: 60,
    type: 'secondary',
  },
  {
    id: '411',
    name: 'Déflecteur',
    image: '/assets/items/Deflecteur.webp',
    tech: 250,
    integrity: 150,
    type: 'secondary',
    prerequisites: [
      {
        property: 'robustness',
        value: 130,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 15,
      },
    ],
  },
  {
    id: '412',
    name: 'Epaulettes',
    image: '/assets/items/Epaulettes.webp',
    tech: 350,
    integrity: 100,
    type: 'secondary',
    effects: [
      {
        property: 'robustness',
        value: 10,
      },
      {
        property: 'agility',
        value: -5,
      },
    ],
  },
  {
    id: '413',
    name: 'Epaulettes en Cristal',
    image: '/assets/items/Epaulettes.webp',
    tech: 380,
    integrity: 120,
    type: 'secondary',
    effects: [
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '414',
    name: 'Jetpack E1',
    image: '/assets/items/JET_PACK_262px.webp',
    tech: 220,
    integrity: 40,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '415',
    name: 'Lunettes Cyber',
    image: '/assets/items/Lunettes_cyber.webp',
    tech: 160,
    integrity: 40,
    type: 'secondary',
    prerequisites: [
      {
        property: 'computing',
        value: 150,
      },
    ],
    effects: [
      {
        property: 'computing',
        value: 25,
      },
    ],
  },
  {
    id: '416',
    name: 'Lunettes Cyber 2.0',
    image: '/assets/items/Lunettes_cyber_2.0.webp',
    tech: 160,
    integrity: 60,
    type: 'secondary',
    effects: [
      {
        property: 'computing',
        value: 25,
      },
    ],
  },
  {
    id: '417',
    name: 'Lunettes de soleil',
    image: '/assets/items/Lunettes_de_soleil.webp',
    tech: 90,
    integrity: 20,
    type: 'secondary',
    effects: [
      {
        property: 'stealth',
        value: 5,
      },
    ],
  },
  {
    id: '418',
    name: 'Lunettes de vision nocturne',
    image:
      '/assets/items/Lunettes_de_vision_nocturne.webp',
    tech: 240,
    integrity: 50,
    type: 'secondary',
    effects: [
      {
        property: 'perception',
        value: 16,
      },
    ],
  },
  {
    id: '419',
    name: 'Cache-oeil',
    image: '/assets/items/Cache-oeil.webp',
    tech: 400,
    integrity: 60,
    type: 'secondary',
    effects: [
      {
        property: 'perception',
        value: -10,
      },
    ],
  },
  {
    id: '420',
    name: 'Mitaines',
    image: '/assets/items/Mitaines.webp',
    tech: 360,
    integrity: 50,
    type: 'secondary',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
    ],
  },
  {
    id: '421',
    name: "Module d'invisibilité",
    image: '/assets/items/Module_dinvisibilite.webp',
    tech: 140,
    integrity: 50,
    type: 'secondary',
    prerequisites: [
      {
        property: 'stealth',
        value: 20,
      },
    ],
    effects: [
      {
        property: 'stealth',
        value: 25,
      },
    ],
  },
  {
    id: '422',
    name: 'Nucléodeck',
    image: '/assets/items/Nucleodeck.webp',
    tech: 320,
    integrity: 60,
    type: 'secondary',
    prerequisites: [
      {
        property: 'computing',
        value: 200,
      },
    ],
    effects: [
      {
        property: 'computing',
        value: 17,
      },
      {
        property: 'engineering',
        value: 7,
      },
    ],
  },
  {
    id: '423',
    name: 'Parapactum',
    image: '/assets/items/Parapactum.webp',
    tech: 320,
    integrity: 60,
    type: 'secondary',
    effects: [
      {
        property: 'robustness',
        value: 8,
      },
    ],
  },
  {
    id: '424',
    name: 'Trousse de secours',
    image: '/assets/items/Trousse_de_secours.webp',
    tech: 320,
    integrity: 780,
    type: 'secondary',
    prerequisites: [
      {
        property: 'medicine',
        value: 150,
      },
    ],
    effects: [
      {
        property: 'medicine',
        value: 10,
      },
    ],
  },
  {
    id: '425',
    name: 'Monocle',
    image: '/assets/items/Monocle.webp',
    tech: 240,
    integrity: 80,
    type: 'secondary',
    effects: [
      {
        property: 'perception',
        value: 12,
      },
    ],
  },
  {
    id: '426',
    name: 'Overboard',
    image: '/assets/items/HOVERBOARD262.webp',
    tech: 240,
    integrity: 60,
    type: 'secondary',
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '427',
    name: 'Drone AXXXN',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 350,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
      {
        property: 'stealth',
        value: -15,
      },
    ],
  },
  {
    id: '428',
    name: 'Drone AXXXP',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 250,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'robustness',
        value: 15,
      },
    ],
  },
  {
    id: '429',
    name: 'Drone AXXXT',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 240,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'perception',
        value: 16,
      },
    ],
  },
  {
    id: '430',
    name: 'Drone AXXXL',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 140,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'stealth',
        value: 25,
      },
    ],
  },
  {
    id: '431',
    name: 'Drone AXXXJ',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 160,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'engineering',
        value: 21,
      },
    ],
  },
  {
    id: '432',
    name: 'Drone AXXXO',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 320,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'medicine',
        value: 10,
      },
    ],
  },
  {
    id: '433',
    name: 'Drone AXXXD',
    image:
      '/assets/items/TENUE_A-317_DRONE_ROUGE_262-PX.webp',
    tech: 330,
    integrity: 300,
    type: 'secondary',
    effects: [
      {
        property: 'engineering',
        value: 7,
      },
      {
        property: 'computing',
        value: 15,
      },
    ],
  },
  {
    id: '434',
    name: 'Celeris A',
    image: '/assets/items/Overlongboard_5.webp',
    tech: 220,
    integrity: 70,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '435',
    name: 'Cape',
    image: '/assets/items/Overlongboard_5.webp',
    tech: 360,
    integrity: 50,
    type: 'secondary',
    effects: [
      {
        property: 'stealth',
        value: 16,
      },
    ],
  },
  {
    id: '436',
    name: 'Vaychette Noir',
    image: '/assets/items/Vaychette_noir.webp',
    tech: 350,
    integrity: 40,
    type: 'secondary',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
    ],
  },
  {
    id: '437',
    name: 'Anneau Rebelle',
    image: '/assets/items/Anneau_rebelle.webp',
    tech: 0,
    integrity: 600,
    type: 'secondary',
  },
  {
    id: '438',
    name: 'Diamant jaune',
    image: '/assets/items/',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '439',
    name: 'Anneau Or',
    image: '/assets/items/Anneau_or.webp',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '440',
    name: 'Bague Emeraude',
    image: '/assets/items/Bague_emeraude.webp',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '441',
    name: 'Chevalière Argent',
    image: '/assets/items/Chevaliere_argent.webp',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '442',
    name: 'Bracelet Lux',
    image: '/assets/items/Bracelet.webp',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '443',
    name: 'Bracelet impérial',
    image: '/assets/items/Bracelet_lux.webp',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '444',
    name: 'Ceinture féminine',
    image: '/assets/items/Ceinture_feminine.webp',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '445',
    name: 'Holster',
    image: '/assets/items/Holster.webp',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '446',
    name: 'Collier Cyber',
    image: '/assets/items/Collier_Cyber.webp',
    tech: 330,
    integrity: 120,
    type: 'secondary',
    prerequisites: [
      {
        property: 'computing',
        value: 150,
      },
    ],
    effects: [
      {
        property: 'computing',
        value: 15,
      },
      {
        property: 'engineering',
        value: 7,
      },
    ],
  },
  {
    id: '447',
    name: 'Cravate',
    image: '/assets/items/Cravate.webp',
    tech: 360,
    integrity: 60,
    type: 'secondary',
  },
  {
    id: '448',
    name: 'Jetpack F1',
    image: '/assets/items/JET_PACK_V2_262px.webp',
    tech: 220,
    integrity: 40,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '449',
    name: 'Lunettes rétro',
    image: '/assets/items/Lunettes_retro.webp',
    tech: 90,
    integrity: 20,
    type: 'secondary',
    effects: [
      {
        property: 'stealth',
        value: 5,
      },
    ],
  },
  {
    id: '450',
    name: 'Gants Dentelles',
    image: '/assets/items/Gants_dentelle.webp',
    tech: 360,
    integrity: 50,
    type: 'secondary',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
    ],
  },
  {
    id: '451',
    name: 'Over-A370',
    image: '/assets/items/Over-A370.webp',
    tech: 240,
    integrity: 60,
    type: 'secondary',
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '452',
    name: 'Vaychette Original',
    image: '/assets/items/Vaychette_original.webp',
    tech: 350,
    integrity: 40,
    type: 'secondary',
    effects: [
      {
        property: 'strength',
        value: 6,
      },
    ],
  },
  {
    id: '453',
    name: 'Celeris K',
    image: '/assets/items/Overlongboard_5.webp',
    tech: 220,
    integrity: 70,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '454',
    name: 'Celeris X',
    image: '/assets/items/Overlongboard_1.webp',
    tech: 220,
    integrity: 70,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '455',
    name: 'Celeris W',
    image: '/assets/items/Overlongboard_4.webp',
    tech: 220,
    integrity: 70,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
  {
    id: '456',
    name: 'Celeris Z',
    image: '/assets/items/Overlongboard_2.webp',
    tech: 220,
    integrity: 70,
    type: 'secondary',
    prerequisites: [
      {
        property: 'agility',
        value: 110,
      },
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -8,
      },
      {
        property: 'stealth',
        value: -15,
      },
      {
        property: 'speed',
        value: 1,
      },
    ],
  },
];
