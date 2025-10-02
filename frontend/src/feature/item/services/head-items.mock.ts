import type { ItemResponseDto } from './item.dto';

export const MOCK_HEAD_ITEMS: ItemResponseDto[] = [
  {
    id: '1',
    name: 'Bandana Jaune/Vert/Rouge/Noir/Bleu',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/4a/Bandana_noir.png/50px-Bandana_noir.png',
    tech: 300,
    integrity: 90,
    type: 'head',
    prerequisites: [
      {
        property: 'agility',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'strength',
        value: 8,
      },
      {
        property: 'agility',
        value: 7,
      },
      {
        property: 'robustness',
        value: -5,
      },
    ],
  },
  {
    id: '2',
    name: 'Bonnet',
    image:
      'https://wiki.dreadcast.net/images/thumb/5/58/Bonnet.png/50px-Bonnet.png',
    tech: 380,
    integrity: 90,
    type: 'head',
  },
  {
    id: '3',
    name: 'Cagoule Tech4',
    image:
      'https://wiki.dreadcast.net/images/thumb/5/53/COMBINAISON_TECH-4_CASQUE.png/50px-COMBINAISON_TECH-4_CASQUE.png',
    tech: 330,
    integrity: 100,
    type: 'head',
    prerequisites: [
      {
        property: 'engineering',
        value: 150,
      },
    ],
    effects: [
      {
        property: 'engineering',
        value: 5,
      },
    ],
  },
  {
    id: '4',
    name: 'Calot',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/e7/Calot.png/50px-Calot.png',
    tech: 320,
    integrity: 65,
    type: 'head',
    prerequisites: [
      {
        property: 'medicine',
        value: 30,
      },
    ],
    effects: [
      {
        property: 'medicine',
        value: 7,
      },
    ],
  },
  {
    id: '5',
    name: 'Casque ancien',
    image:
      'https://wiki.dreadcast.net/images/thumb/d/d5/ARMURE_ANCIENNE_HEAUME.png/70px-ARMURE_ANCIENNE_HEAUME.png',
    tech: 280,
    integrity: 180,
    type: 'head',
    prerequisites: [
      {
        property: 'strength',
        value: 60,
      },
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 12,
      },
    ],
  },
  {
    id: '6',
    name: 'Casque Anti-Emeute / Casque de Dreadball',
    image: 'https://wiki.dreadcast.net/images/1/1c/Casque_antiemeute.png',
    tech: 320,
    integrity: 110,
    type: 'head',
    prerequisites: [
      {
        property: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 10,
      },
      {
        property: 'perception',
        value: -2,
      },
    ],
  },
  {
    id: '7',
    name: 'Casque Audio V1/V2',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a7/Casque-audio-V2.png/50px-Casque-audio-V2.png',
    tech: 380,
    integrity: 90,
    type: 'head',
  },
  {
    id: '8',
    name: 'Casque réglable',
    image:
      'https://wiki.dreadcast.net/images/thumb/1/1c/Casque_dingenieur.png/50px-Casque_dingenieur.png',
    tech: 200,
    integrity: 90,
    type: 'head',
    prerequisites: [
      {
        property: 'engineering',
        value: 130,
      },
    ],
    effects: [
      {
        property: 'engineering',
        value: 15,
      },
    ],
  },
  {
    id: '9',
    name: 'Casque de Chantier / Loupe Binoculaire',
    image:
      'https://wiki.dreadcast.net/images/thumb/0/04/Casque_de_chantier.png/50px-Casque_de_chantier.png',
    tech: 330,
    integrity: 120,
    type: 'head',
    prerequisites: [
      {
        property: 'engineering',
        value: 30,
      },
    ],
    effects: [
      {
        property: 'engineering',
        value: 5,
      },
    ],
  },
  {
    id: '10',
    name: 'Casque intégral',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a4/CASQUE_PILOTE_HD.png/50px-CASQUE_PILOTE_HD.png',
    tech: 210,
    integrity: 100,
    type: 'head',
    prerequisites: [
      {
        property: 'computing',
        value: 130,
      },
    ],
    effects: [
      {
        property: 'perception',
        value: 5,
      },
      {
        property: 'computing',
        value: 15,
      },
    ],
  },
  {
    id: '11',
    name: 'Casque M21',
    image:
      'https://wiki.dreadcast.net/images/thumb/b/bb/Casque_m21.png/50px-Casque_m21.png',
    tech: 350,
    integrity: 130,
    type: 'head',
    prerequisites: [
      {
        property: 'robustness',
        value: 80,
      },
      {
        property: 'perception',
        value: 100,
      },
    ],
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
        value: 5,
      },
    ],
  },
  {
    id: '12',
    name: 'Casquette (Noire/de Fan/Citadun/Oxium)',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/e4/Casquette_bleu.png/50px-Casquette_bleu.png',
    tech: 300,
    integrity: 60,
    type: 'head',
    effects: [
      {
        property: 'robustness',
        value: -5,
      },
      {
        property: 'perception',
        value: 8,
      },
      {
        property: 'stealth',
        value: 5,
      },
    ],
  },
  {
    id: '13',
    name: 'Casquette Impérialiste',
    image:
      'https://wiki.dreadcast.net/images/thumb/3/3e/Casquette_imperiale_HD.png/50px-Casquette_imperiale_HD.png',
    tech: 330,
    integrity: 80,
    type: 'head',
    effects: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'robustness',
        value: -3,
      },
    ],
  },
  {
    id: '14',
    name: 'Chapeau de Shérif',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/e8/Chapeau_de_sherif.png/50px-Chapeau_de_sherif.png',
    tech: 350,
    integrity: 75,
    type: 'head',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
    ],
  },
  {
    id: '15',
    name: 'Cyber Locks bleu/rouge',
    image:
      'https://wiki.dreadcast.net/images/thumb/9/99/Cyber-locks-bleu.png/50px-Cyber-locks-bleu.png',
    tech: 380,
    integrity: 60,
    type: 'head',
  },
  {
    id: '16',
    name: 'Foulard',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/4b/Foulard.png/50px-Foulard.png',
    tech: 280,
    integrity: 90,
    type: 'head',
    prerequisites: [
      {
        property: 'agility',
        value: 60,
      },
      {
        property: 'stealth',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'stealth',
        value: 14,
      },
    ],
  },
  {
    id: '17',
    name: 'Cyber-lunettes',
    image:
      'https://wiki.dreadcast.net/images/thumb/2/29/Cyber_lunettes.png/50px-Cyber_lunettes.png',
    tech: 320,
    integrity: 80,
    type: 'head',
    prerequisites: [
      {
        property: 'computing',
        value: 30,
      },
    ],
    effects: [
      {
        property: 'computing',
        value: 9,
      },
    ],
  },
  {
    id: '18',
    name: 'Masque à Gaz',
    image:
      'https://wiki.dreadcast.net/images/thumb/b/b2/Masque_a_gaz.png/50px-Masque_a_gaz.png',
    tech: 360,
    integrity: 120,
    type: 'head',
    prerequisites: [
      {
        property: 'robustness',
        value: 50,
      },
      {
        property: 'engineering',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'perception',
        value: -5,
      },
      {
        property: 'health',
        value: 12,
      },
    ],
  },
  {
    id: '19',
    name: "Masque d'Ecureuil/de Rat",
    image:
      'https://wiki.dreadcast.net/images/thumb/5/56/Masque_decureuil.png/50px-Masque_decureuil.png',
    tech: 300,
    integrity: 60,
    type: 'head',
    prerequisites: [
      {
        property: 'stealth',
        value: 10,
      },
    ],
    effects: [
      {
        property: 'stealth',
        value: 9,
      },
    ],
  },
  {
    id: '20',
    name: 'Masque de la Peste/Exogène/NO/Chauve-souris',
    image:
      'https://wiki.dreadcast.net/images/thumb/6/60/Masque_de_la_peste.png/50px-Masque_de_la_peste.png',
    tech: 360,
    integrity: 100,
    type: 'head',
    prerequisites: [
      {
        property: 'robustness',
        value: 50,
      },
      {
        property: 'perception',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -2,
      },
      {
        property: 'perception',
        value: 6,
      },
    ],
  },
  {
    id: '21',
    name: 'Oreilles de lapin',
    image:
      'https://wiki.dreadcast.net/images/thumb/5/56/Oreilles_de_lapin.png/50px-Oreilles_de_lapin.png',
    tech: 0,
    integrity: 10,
    type: 'head',
  },
  {
    id: '22',
    name: 'Perruque bleue/rousse',
    image:
      'https://wiki.dreadcast.net/images/thumb/f/fc/Perruque_bleue.png/50px-Perruque_bleue.png',
    tech: 0,
    integrity: 20,
    type: 'head',
  },
  {
    id: '23',
    name: 'Binocle punk',
    image:
      'https://wiki.dreadcast.net/images/thumb/6/65/BINOCLES-PUNK_HD.png/50px-BINOCLES-PUNK_HD.png',
    tech: 360,
    integrity: 90,
    type: 'head',
    effects: [
      {
        property: 'perception',
        value: 6,
      },
      {
        property: 'stealth',
        value: 6,
      },
    ],
  },
  {
    id: '24',
    name: 'Borsalino',
    image:
      'https://wiki.dreadcast.net/images/thumb/7/71/BORSALINO_HD.png/50px-BORSALINO_HD.png',
    tech: 340,
    integrity: 100,
    type: 'head',
    effects: [
      {
        property: 'agility',
        value: 7,
      },
      {
        property: 'stealth',
        value: 7,
      },
    ],
  },
  {
    id: '25',
    name: "Capuche D'invibilité",
    image:
      'https://wiki.dreadcast.net/images/thumb/8/86/CAPUCHE_INVISIBILITE262.png/100px-CAPUCHE_INVISIBILITE262.png',
    tech: 280,
    integrity: 80,
    type: 'head',
    effects: [
      {
        property: 'stealth',
        value: 14,
      },
    ],
  },
  {
    id: '26',
    name: 'Casque AXXXD',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 320,
    integrity: 300,
    type: 'head',
    effects: [
      {
        property: 'computing',
        value: 9,
      },
    ],
  },
  {
    id: '27',
    name: 'Casque AXXXJ',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 330,
    integrity: 300,
    type: 'head',
    effects: [
      {
        property: 'engineering',
        value: 5,
      },
    ],
  },
  {
    id: '28',
    name: 'Casque AXXXL',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 280,
    integrity: 300,
    type: 'head',
    effects: [
      {
        property: 'stealth',
        value: 14,
      },
    ],
  },
  {
    id: '29',
    name: 'Casque AXXXN',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 400,
    integrity: 300,
    type: 'head',
  },
  {
    id: '30',
    name: 'Casque AXXXO',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 400,
    integrity: 300,
    type: 'head',
    effects: [
      {
        property: 'medicine',
        value: 7,
      },
    ],
  },
  {
    id: '31',
    name: 'Casque AXXXP',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 280,
    integrity: 300,
    type: 'head',
    effects: [
      {
        property: 'robustness',
        value: 12,
      },
    ],
  },
  {
    id: '32',
    name: 'Casque AXXXT',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/c2/Casque_A300.png/50px-Casque_A300.png',
    tech: 360,
    integrity: 300,
    type: 'head',
    effects: [
      {
        property: 'perception',
        value: 6,
      },
    ],
  },
  {
    id: '33',
    name: 'Haut de forme',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/ce/HAUT-DE-FORME_HD.png/50px-HAUT-DE-FORME_HD.png',
    tech: 400,
    integrity: 80,
    type: 'head',
  },
  {
    id: '34',
    name: 'Masque Squelette',
    image:
      'https://wiki.dreadcast.net/images/thumb/c/cd/Masque_squelette.png/50px-Masque_squelette.png',
    tech: 400,
    integrity: 130,
    type: 'head',
    effects: [
      {
        property: 'robustness',
        value: 4,
      },
      {
        property: 'perception',
        value: 4,
      },
      {
        property: 'computing',
        value: 3,
      },
    ],
  },
  {
    id: '35',
    name: 'Respirateur',
    image:
      'https://wiki.dreadcast.net/images/thumb/2/29/RESPIRATEUR_HD.png/50px-RESPIRATEUR_HD.png',
    tech: 350,
    integrity: 150,
    type: 'head',
    effects: [
      {
        property: 'health',
        value: 6,
      },
      {
        property: 'stamina',
        value: 6,
      },
    ],
  },
  {
    id: '36',
    name: 'Combinaison Tech5',
    image:
      'https://wiki.dreadcast.net/images/thumb/d/d9/COMBINAISON_TECH-5_CASQUE262.png/100px-COMBINAISON_TECH-5_CASQUE262.png',
    tech: 330,
    integrity: 150,
    type: 'head',
    effects: [
      {
        property: 'engineering',
        value: 5,
      },
    ],
  },
  {
    id: '37',
    name: 'Chapeau pointu',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/e1/Chapeau_pointu.png/50px-Chapeau_pointu.png',
    tech: 0,
    integrity: 5,
    type: 'head',
  },
  {
    id: '38',
    name: 'Cagoule',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a9/Cagoule.png/50px-Cagoule.png',
    tech: 300,
    integrity: 320,
    type: 'head',
    prerequisites: [
      {
        property: 'stealth',
        value: 125,
      },
    ],
    effects: [
      {
        property: 'stealth',
        value: 5,
      },
    ],
  },
];
