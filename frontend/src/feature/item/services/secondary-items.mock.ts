import type { ItemResponseDto } from './item.dto';

export const MOCK_SECONDARY_ITEMS: ItemResponseDto[] = [
  {
    id: '400',
    name: 'Anneau Imperial',
    image: 'https://wiki.dreadcast.net/images/4/42/Anneau_imperial.png',
    tech: 0,
    integrity: 600,
    type: 'secondary',
  },
  {
    id: '401',
    name: 'Bague saphir pourpre',
    image: 'https://wiki.dreadcast.net/images/4/4c/Bague_saphir_pourpre.png',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '402',
    name: 'Boite à outils',
    image: 'https://wiki.dreadcast.net/images/8/86/Boite_a_outils.png',
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
    image: 'https://wiki.dreadcast.net/images/3/33/Bracelet.png',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '404',
    name: 'Ceinture',
    image: 'https://wiki.dreadcast.net/images/b/b8/Ceinture.png',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '405',
    name: 'Ceinture titane',
    image: 'https://wiki.dreadcast.net/images/c/c3/Ceinture_titane.png',
    tech: 400,
    integrity: 100,
    type: 'secondary',
  },
  {
    id: '406',
    name: 'Chaîne',
    image: 'https://wiki.dreadcast.net/images/5/5c/Chaine.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ea/Cibleur.png',
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
    image: 'https://wiki.dreadcast.net/images/0/03/Collier_en_cuir.png',
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
    image: 'https://wiki.dreadcast.net/images/a/a5/Collier_tech.png',
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
    image: 'https://wiki.dreadcast.net/images/9/99/Cravate.png',
    tech: 360,
    integrity: 60,
    type: 'secondary',
  },
  {
    id: '411',
    name: 'Déflecteur',
    image: 'https://wiki.dreadcast.net/images/3/3f/Deflecteur.png',
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
    image: 'https://wiki.dreadcast.net/images/a/af/Epaulettes.png',
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
    image: 'https://wiki.dreadcast.net/images/a/af/Epaulettes.png',
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
    image: 'https://wiki.dreadcast.net/images/3/3a/JET_PACK_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/2/2a/Lunettes_cyber.png',
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
    image: 'https://wiki.dreadcast.net/images/b/b9/Lunettes_cyber_2.0.png',
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
    image: 'https://wiki.dreadcast.net/images/6/61/Lunettes_de_soleil.png',
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
      'https://wiki.dreadcast.net/images/8/81/Lunettes_de_vision_nocturne.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7f/Cache-oeil.png',
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
    image: 'https://wiki.dreadcast.net/images/1/13/Mitaines.png',
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
    image: 'https://wiki.dreadcast.net/images/b/b5/Module_dinvisibilite.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ec/Nucleodeck.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f0/Parapactum.png',
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
    image: 'https://wiki.dreadcast.net/images/9/92/Trousse_de_secours.png',
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
    image: 'https://wiki.dreadcast.net/images/0/00/Monocle.png',
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
    name: 'OVerboard',
    image: 'https://wiki.dreadcast.net/images/4/4d/HOVERBOARD262.png',
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
    name: 'Drone A3XXXN',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Drone A3XXXP',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Drone A3XXXT',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Drone A3XXXL',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Drone A3XXXJ',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Drone A3XXXO',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Drone A3XXXD',
    image:
      'https://wiki.dreadcast.net/images/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    image: 'https://wiki.dreadcast.net/images/5/54/Overlongboard_5.png',
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
    image: 'https://wiki.dreadcast.net/images/5/54/Overlongboard_5.png',
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
    image: 'https://wiki.dreadcast.net/images/8/88/Vaychette_noir.png',
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
    image: 'https://wiki.dreadcast.net/images/1/1c/Anneau_rebelle.png',
    tech: 0,
    integrity: 600,
    type: 'secondary',
  },
  {
    id: '438',
    name: 'Diamant jaune',
    image: 'https://wiki.dreadcast.net/images/0/01/Diamant_jaune.png/',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '439',
    name: 'Anneau Or',
    image: 'https://wiki.dreadcast.net/images/9/9a/Anneau_or.png',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '440',
    name: 'Bague Emeraude',
    image: 'https://wiki.dreadcast.net/images/9/97/Bague_emeraude.png',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '441',
    name: 'Chevalière Argent',
    image: 'https://wiki.dreadcast.net/images/f/f0/Chevaliere_argent.png',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '442',
    name: 'Bracelet Lux',
    image: 'https://wiki.dreadcast.net/images/3/33/Bracelet.png',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '443',
    name: 'Bracelet impérial',
    image: 'https://wiki.dreadcast.net/images/a/ad/Bracelet_lux.png',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '444',
    name: 'Ceinture féminine',
    image: 'https://wiki.dreadcast.net/images/5/5e/Ceinture_feminine.png',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '445',
    name: 'Holster',
    image: 'https://wiki.dreadcast.net/images/8/8d/Holster.png',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '446',
    name: 'Collier Cyber',
    image: 'https://wiki.dreadcast.net/images/d/dc/Collier_Cyber.png',
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
    image: 'https://wiki.dreadcast.net/images/9/99/Cravate.png',
    tech: 360,
    integrity: 60,
    type: 'secondary',
  },
  {
    id: '448',
    name: 'Jetpack F1',
    image: 'https://wiki.dreadcast.net/images/c/c1/JET_PACK_V2_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/5/54/Lunettes_retro.png',
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
    image: 'https://wiki.dreadcast.net/images/e/eb/Gants_dentelle.png',
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
    image: 'https://wiki.dreadcast.net/images/4/40/Over-A370.png',
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
    image: 'https://wiki.dreadcast.net/images/d/dd/Vaychette_original.png',
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
    image: 'https://wiki.dreadcast.net/images/5/54/Overlongboard_5.png',
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
    image: 'https://wiki.dreadcast.net/images/e/e7/Overlongboard_1.png',
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
    image: 'https://wiki.dreadcast.net/images/2/20/Overlongboard_4.png',
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
    image: 'https://wiki.dreadcast.net/images/7/70/Overlongboard_2.png',
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
