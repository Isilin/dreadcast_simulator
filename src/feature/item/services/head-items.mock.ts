import type { ItemResponseDto } from './item.dto';

export const MOCK_HEAD_ITEMS: ItemResponseDto[] = [
  {
    id: '1',
    name: 'Bandana Jaune',
    image: '/assets/items/Bandana_jaune.webp',
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
    image: '/assets/items/Bonnet.webp',
    tech: 380,
    integrity: 90,
    type: 'head',
  },
  {
    id: '3',
    name: 'Cagoule Tech4',
    image:
      '/assets/items/COMBINAISON_TECH-4_CASQUE.webp',
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
    image: '/assets/items/Calot.webp',
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
    image: '/assets/items/ARMURE_ANCIENNE_HEAUME.webp',
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
    name: 'Casque Anti-Emeute',
    image: '/assets/items/Casque_antiemeute.webp',
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
    name: 'Casque Audio V1',
    image: '/assets/items/Casque-audio-V1.webp',
    tech: 380,
    integrity: 90,
    type: 'head',
  },
  {
    id: '8',
    name: 'Casque réglable',
    image: '/assets/items/Casque_dingenieur.webp',
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
    name: 'Casque de Chantier',
    image: '/assets/items/Casque_de_chantier.webp',
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
    image: '/assets/items/CASQUE_PILOTE_HD.webp',
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
    image: '/assets/items/Casque_m21.webp',
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
    name: 'Casquette',
    image: '/assets/items/Casquette_bleu.webp',
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
    image: '/assets/items/Casquette_imperiale_HD.webp',
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
    image: '/assets/items/Chapeau_de_sherif.webp',
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
    name: 'Cyber Locks bleu',
    image: '/assets/items/Cyber-locks-bleu.webp',
    tech: 380,
    integrity: 60,
    type: 'head',
  },
  {
    id: '16',
    name: 'Foulard',
    image: '/assets/items/Foulard.webp',
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
    image: '/assets/items/Cyber_lunettes.webp',
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
    image: '/assets/items/Masque_a_gaz.webp',
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
    name: "Masque d'Ecureuil",
    image: '/assets/items/Masque_decureuil.webp',
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
    name: 'Masque de la Peste',
    image: '/assets/items/Masque_de_la_peste.webp',
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
    image: '/assets/items/Oreilles_de_lapin.webp',
    tech: 0,
    integrity: 10,
    type: 'head',
  },
  {
    id: '22',
    name: 'Perruque bleue',
    image: '/assets/items/Perruque_bleue.webp',
    tech: 0,
    integrity: 20,
    type: 'head',
  },
  {
    id: '23',
    name: 'Binocle punk',
    image: '/assets/items/BINOCLES-PUNK_HD.webp',
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
    image: '/assets/items/BORSALINO_HD.webp',
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
    image: '/assets/items/CAPUCHE_INVISIBILITE262.webp',
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
    image: '/assets/items/Casque_A300.webp',
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
    image: '/assets/items/Casque_A300.webp',
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
    image: '/assets/items/Casque_A300.webp',
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
    image: '/assets/items/Casque_A300.webp',
    tech: 400,
    integrity: 300,
    type: 'head',
  },
  {
    id: '30',
    name: 'Casque AXXXO',
    image: '/assets/items/Casque_A300.webp',
    tech: 320,
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
    image: '/assets/items/Casque_A300.webp',
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
    image: '/assets/items/Casque_A300.webp',
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
    image: '/assets/items/HAUT-DE-FORME_HD.webp',
    tech: 400,
    integrity: 80,
    type: 'head',
  },
  {
    id: '34',
    name: 'Masque Squelette',
    image: '/assets/items/Masque_squelette.webp',
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
    image: '/assets/items/RESPIRATEUR_HD.webp',
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
      '/assets/items/COMBINAISON_TECH-5_CASQUE262.webp',
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
    image: '/assets/items/Chapeau_pointu.webp',
    tech: 0,
    integrity: 5,
    type: 'head',
  },
  {
    id: '38',
    name: 'Cagoule',
    image: '/assets/items/Cagoule.webp',
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
  {
    id: '39',
    name: 'Bandana Vert',
    image: '/assets/items/Bandana_vert.webp',
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
    id: '40',
    name: 'Bandana Rouge',
    image: '/assets/items/Bandana_rouge.webp',
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
    id: '41',
    name: 'Bandana Noir',
    image: '/assets/items/Bandana_noir.webp',
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
    id: '42',
    name: 'Bandana Bleu',
    image: '/assets/items/Bandana_bleu.webp',
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
    id: '43',
    name: 'Casque de Dreadball',
    image: '/assets/items/Casque_dreadball.webp',
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
    id: '44',
    name: 'Casque Audio V2',
    image: '/assets/items/Casque-audio-V2.webp',
    tech: 380,
    integrity: 90,
    type: 'head',
  },
  {
    id: '45',
    name: 'Loupe Binoculaire',
    image: '/assets/items/Loupe_binoculaire.webp',
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
    id: '46',
    name: 'Casquette Noire',
    image: '/assets/items/Casquette_noir.webp',
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
    id: '47',
    name: 'Casquette de Fan',
    image: '/assets/items/Casquette_de_fan.webp',
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
    id: '48',
    name: 'Casquette Citadun',
    image: '/assets/items/Casquette_citadiun.webp',
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
    id: '49',
    name: 'Casquette Oxium',
    image: '/assets/items/Casquette_oxum.webp',
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
    id: '50',
    name: 'Cyber Locks rouge',
    image: '/assets/items/Cyber-locks-rouge.webp',
    tech: 380,
    integrity: 60,
    type: 'head',
  },
  {
    id: '51',
    name: 'Masque de Rat',
    image: '/assets/items/Masque_de_rat.webp',
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
    id: '52',
    name: 'Masque Exogène',
    image: '/assets/items/MASQUE-MONSTRE_262-PX.webp',
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
    id: '53',
    name: 'Masque NO',
    image: '/assets/items/Masque_no.webp',
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
    id: '54',
    name: 'Masque Chauve-souris',
    image: '/assets/items/Masque_chauve_souris.webp',
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
    id: '55',
    name: 'Perruque rousse',
    image: '/assets/items/Perruque.webp',
    tech: 0,
    integrity: 20,
    type: 'head',
  },
  {
    id: '56',
    name: 'Béret révolutionnaire',
    image: '/assets/items/Beret_revolutionnaire.webp',
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
    id: '57',
    name: 'Masque à gaz rebelle',
    image: '/assets/items/Masque_a_gaz_rebelle.webp',
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
    id: '58',
    name: 'Casque Méta',
    image: '/assets/items/Casque_meta.webp',
    tech: 380,
    integrity: 90,
    type: 'head',
  },
];
