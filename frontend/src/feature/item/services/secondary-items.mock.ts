import type { ItemResponseDto } from './item.dto';

export const MOCK_SECONDARY_ITEMS: ItemResponseDto[] = [
  {
    id: '400',
    name: 'Anneau Imperial',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/42/Anneau_imperial.png/50px-Anneau_imperial.png',
    tech: 0,
    integrity: 600,
    type: 'secondary',
  },
  {
    id: '401',
    name: 'Bague saphir pourpre/Diamant jaune/Anneau Or/Bague Emeraude/Saphire Pourpre/Chevalière Argent',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/4c/Bague_saphir_pourpre.png/50px-Bague_saphir_pourpre.png',
    tech: 0,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '402',
    name: 'Boite à outils',
    image:
      'https://wiki.dreadcast.net/images/thumb/8/86/Boite_a_outils.png/50px-Boite_a_outils.png',
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
    name: 'Bracelet/Bracelet Lux/Bracelet impérial/Bracelet or',
    image:
      'https://wiki.dreadcast.net/images/thumb/3/33/Bracelet.png/50px-Bracelet.png',
    tech: 0,
    integrity: 40,
    type: 'secondary',
  },
  {
    id: '404',
    name: 'Ceinture/Ceinture féminine/Holster',
    image:
      'https://wiki.dreadcast.net/images/thumb/b/b8/Ceinture.png/50px-Ceinture.png',
    tech: 360,
    integrity: 50,
    type: 'secondary',
  },
  {
    id: '405',
    name: 'Ceinture titane',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c3/Ceinture_titane.png/50px-Ceinture_titane.png',
    tech: 400,
    integrity: 100,
    type: 'secondary',
  },
  {
    id: '406',
    name: 'Chaîne',
    image:
      'https://wiki.dreadcast.net/images/thumb/5/5c/Chaine.png/50px-Chaine.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ea/Cibleur.png/50px-Cibleur.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/0/03/Collier_en_cuir.png/50px-Collier_en_cuir.png',
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
    name: "Collier tech'/Collier Cyber",
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a5/Collier_tech.png/50px-Collier_tech.png',
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
    name: 'Pendentif Cristal/Cravate',
    image:
      'https://wiki.dreadcast.net/images/thumb/9/99/Cravate.png/50px-Cravate.png',
    tech: 360,
    integrity: 60,
    type: 'secondary',
  },
  {
    id: '411',
    name: 'Déflecteur',
    image:
      'https://wiki.dreadcast.net/images/thumb/3/3f/Deflecteur.png/50px-Deflecteur.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/a/af/Epaulettes.png/50px-Epaulettes.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/a/af/Epaulettes.png/50px-Epaulettes.png',
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
    name: 'Jetpack E1/F1',
    image:
      'https://wiki.dreadcast.net/images/thumb/3/3a/JET_PACK_262px.png/50px-JET_PACK_262px.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/2/2a/Lunettes_cyber.png/50px-Lunettes_cyber.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/b/b9/Lunettes_cyber_2.0.png/50px-Lunettes_cyber_2.0.png',
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
    name: 'Lunettes de soleil/Lunettes rétro',
    image:
      'https://wiki.dreadcast.net/images/thumb/6/61/Lunettes_de_soleil.png/50px-Lunettes_de_soleil.png',
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
      'https://wiki.dreadcast.net/images/thumb/8/81/Lunettes_de_vision_nocturne.png/50px-Lunettes_de_vision_nocturne.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/7/7f/Cache-oeil.png/50px-Cache-oeil.png',
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
    name: 'Mitaines/Gants Dentelles/Vaychette Original/Vaychette Noir',
    image:
      'https://wiki.dreadcast.net/images/thumb/1/13/Mitaines.png/50px-Mitaines.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/b/b5/Module_dinvisibilite.png/50px-Module_dinvisibilite.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ec/Nucleodeck.png/50px-Nucleodeck.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/f/f0/Parapactum.png/50px-Parapactum.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/9/92/Trousse_de_secours.png/50px-Trousse_de_secours.png',
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
    image:
      'https://wiki.dreadcast.net/images/thumb/0/00/Monocle.png/100px-Monocle.png',
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
    name: 'OVerboard/Over-A370',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/4d/HOVERBOARD262.png/150px-HOVERBOARD262.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
      'https://wiki.dreadcast.net/images/thumb/6/62/TENUE_A-317_DRONE_ROUGE_262-PX.png/100px-TENUE_A-317_DRONE_ROUGE_262-PX.png',
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
    name: 'Celeris A/K/X/W/Z',
    image: 'https://wiki.dreadcast.net/images/5/54/Overlongboard_5.png',
    tech: 220,
    integrity: 40,
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
];
