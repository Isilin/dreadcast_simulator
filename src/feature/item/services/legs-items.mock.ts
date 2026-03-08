import type { ItemResponseDto } from './item.dto';

export const MOCK_LEGS_ITEMS: ItemResponseDto[] = [
  {
    id: '200',
    name: 'Bas de robe néon',
    image: '/assets/items/Bas_de_robe_neon.webp',
    tech: 300,
    integrity: 60,
    type: 'legs',
    prerequisites: [
      {
        property: 'agility',
        value: 60,
      },
    ],
  },
  {
    id: '201',
    name: 'Bas élégants',
    image: '/assets/items/ASSETS_Bas_sexy_262-PX.webp',
    tech: 350,
    integrity: 50,
    type: 'legs',
    effects: [
      {
        property: 'stealth',
        value: -10,
      },
    ],
  },
  {
    id: '202',
    name: 'Boxer Moulant',
    image: '/assets/items/Boxermoulant.webp',
    tech: 250,
    integrity: 60,
    type: 'legs',
  },
  {
    id: '203',
    name: 'Collants Dermiques',
    image: '/assets/items/Collants_dermiques.webp',
    tech: 320,
    integrity: 75,
    type: 'legs',
    prerequisites: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'robustness',
        value: 20,
      },
    ],
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
    id: '204',
    name: 'Cyber-futal',
    image: '/assets/items/Decker-jambe.webp',
    tech: 340,
    integrity: 80,
    type: 'legs',
    prerequisites: [
      {
        property: 'computing',
        value: 10,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 6,
      },
      {
        property: 'computing',
        value: 6,
      },
    ],
  },
  {
    id: '205',
    name: 'Exo-Jambières',
    image: '/assets/items/Exo_jambieres.webp',
    tech: 400,
    integrity: 120,
    type: 'legs',
    prerequisites: [
      {
        property: 'strength',
        value: 60,
      },
      {
        property: 'agility',
        value: 100,
      },
    ],
  },
  {
    id: '206',
    name: 'Exo-Jambières de chantier',
    image:
      '/assets/items/Exo-jambieres_de_chantier.webp',
    tech: 340,
    integrity: 120,
    type: 'legs',
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
    id: '207',
    name: 'Gode-ceinture',
    image: '/assets/items/Gode-ceinture.webp',
    tech: 69,
    integrity: 69,
    type: 'legs',
    prerequisites: [
      {
        property: 'agility',
        value: 69,
      },
    ],
  },
  {
    id: '208',
    name: 'Jambières sanguinaires',
    image: '/assets/items/Jambieres_sanguinaires.webp',
    tech: 330,
    integrity: 110,
    type: 'legs',
    prerequisites: [
      {
        property: 'strength',
        value: 120,
      },
      {
        property: 'robustness',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'strength',
        value: 16,
      },
      {
        property: 'agility',
        value: -4,
      },
      {
        property: 'robustness',
        value: -4,
      },
    ],
  },
  {
    id: '209',
    name: 'Jambières Runner',
    image: '/assets/items/Jambieres_runner.webp',
    tech: 330,
    integrity: 100,
    type: 'legs',
    prerequisites: [
      {
        property: 'agility',
        value: 120,
      },
    ],
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
    id: '210',
    name: 'Jambières Techno',
    image: '/assets/items/Jambieres_tecno.webp',
    tech: 340,
    integrity: 110,
    type: 'legs',
    prerequisites: [
      {
        property: 'robustness',
        value: 50,
      },
      {
        property: 'computing',
        value: 120,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 6,
      },
      {
        property: 'computing',
        value: 6,
      },
    ],
  },
  {
    id: '211',
    name: 'Jean Lev',
    image: '/assets/items/Jean.webp',
    tech: 320,
    integrity: 80,
    type: 'legs',
    effects: [
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '212',
    name: 'Jupe Hansen',
    image: '/assets/items/Jupe_hansen.webp',
    tech: 280,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'health',
        value: 15,
      },
    ],
  },
  {
    id: '213',
    name: 'Jupe Métal',
    image: '/assets/items/Jupe_metal.webp',
    tech: 300,
    integrity: 90,
    type: 'legs',
    prerequisites: [
      {
        property: 'strength',
        value: 20,
      },
      {
        property: 'agility',
        value: 20,
      },
    ],
    effects: [
      {
        property: 'agility',
        value: -3,
      },
      {
        property: 'robustness',
        value: 8,
      },
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'health',
        value: 5,
      },
    ],
  },
  {
    id: '214',
    name: 'Jupe Muxo',
    image: '/assets/items/JUPE_MUXO.webp',
    tech: 380,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '215',
    name: 'Jupe Muyang',
    image: '/assets/items/Jupe_muyang.webp',
    tech: 340,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '216',
    name: 'Minishort',
    image: '/assets/items/Minishort.webp',
    tech: 300,
    integrity: 65,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'robustness',
        value: -5,
      },
      {
        property: 'health',
        value: 6,
      },
    ],
  },
  {
    id: '217',
    name: 'Pantalon à poche',
    image: '/assets/items/Pantalon_a_poches.webp',
    tech: 340,
    integrity: 120,
    type: 'legs',
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
    id: '218',
    name: 'Pantalon Bijela',
    image: '/assets/items/Pantalon_Bijela.webp',
    tech: 350,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '219',
    name: 'Pantalon Cosmopolitain',
    image: '/assets/items/Pantalon_cosmopolitain.webp',
    tech: 330,
    integrity: 90,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'robustness',
        value: 3,
      },
    ],
  },
  {
    id: '220',
    name: 'Pantalon Cyber',
    image: '/assets/items/Pantalon_cyber.webp',
    tech: 360,
    integrity: 90,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: 3,
      },
    ],
  },
  {
    id: '221',
    name: 'Pantalon Cyber',
    image: '/assets/items/Pantalon_cyber.webp',
    tech: 310,
    integrity: 85,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'perception',
        value: 3,
      },
    ],
  },
  {
    id: '222',
    name: "Pantalons d'éveil (M)",
    image: '/assets/items/Pantalon_deveil_H.webp',
    tech: 0,
    integrity: 0,
    type: 'legs',
  },
  {
    id: '223',
    name: 'Pantalon Eye',
    image: '/assets/items/Pantalon_eye.webp',
    tech: 400,
    integrity: 90,
    type: 'legs',
  },
  {
    id: '224',
    name: 'Pantalon médical',
    image: '/assets/items/Pantalon_medical.webp',
    tech: 320,
    integrity: 80,
    type: 'legs',
    prerequisites: [
      {
        property: 'medicine',
        value: 30,
      },
    ],
    effects: [
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'medicine',
        value: 13,
      },
    ],
  },
  {
    id: '225',
    name: 'Short Abimé',
    image: '/assets/items/Short_abime.webp',
    tech: 250,
    integrity: 30,
    type: 'legs',
    effects: [
      {
        property: 'robustness',
        value: -5,
      },
      {
        property: 'stealth',
        value: 15,
      },
    ],
  },
  {
    id: '226',
    name: 'Short Boxe',
    image: '/assets/items/Short_boxe.webp',
    tech: 350,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'strength',
        value: 2,
      },
      {
        property: 'agility',
        value: 2,
      },
    ],
  },
  {
    id: '227',
    name: 'Short Cyt',
    image: '/assets/items/Short_cyt.webp',
    tech: 340,
    integrity: 65,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '228',
    name: 'Short Standard',
    image: '/assets/items/Short_standard.webp',
    tech: 380,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '229',
    name: 'Slip Écureuil',
    image: '/assets/items/Slip_ecureuil.webp',
    tech: 300,
    integrity: 65,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'robustness',
        value: -5,
      },
      {
        property: 'health',
        value: 6,
      },
    ],
  },
  {
    id: '230',
    name: 'String Connecté',
    image: '/assets/items/Stringconnecte.webp',
    tech: 400,
    integrity: 100,
    type: 'legs',
    prerequisites: [
      {
        property: 'computing',
        value: 50,
      },
    ],
  },
  {
    id: '231',
    name: 'String Sexy',
    image: '/assets/items/Stringsexy.webp',
    tech: 250,
    integrity: 60,
    type: 'legs',
  },
  {
    id: '232',
    name: 'Jambières squelette',
    image: '/assets/items/Jambieresquelette.webp',
    tech: 400,
    integrity: 130,
    type: 'legs',
    effects: [
      {
        property: 'stealth',
        value: 4,
      },
      {
        property: 'computing',
        value: 6,
      },
    ],
  },
  {
    id: '233',
    name: 'Pantalon AXXXN',
    image: '/assets/items/Pantalon_01.webp',
    tech: 330,
    integrity: 300,
    type: 'legs',
    effects: [
      {
        property: 'strength',
        value: 16,
      },
      {
        property: 'agility',
        value: -4,
      },
      {
        property: 'robustness',
        value: -4,
      },
    ],
  },
  {
    id: '234',
    name: 'Pantalon AXXXP',
    image: '/assets/items/Pantalon_01.webp',
    tech: 400,
    integrity: 300,
    type: 'legs',
  },
  {
    id: '235',
    name: 'Pantalon AXXXL',
    image: '/assets/items/Pantalon_01.webp',
    tech: 360,
    integrity: 300,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: 5,
      },
    ],
  },
  {
    id: '236',
    name: 'Pantalon AXXXJ',
    image: '/assets/items/Pantalon_01.webp',
    tech: 360,
    integrity: 300,
    type: 'legs',
    effects: [
      {
        property: 'engineering',
        value: 5,
      },
    ],
  },
  {
    id: '237',
    name: 'Pantalon AXXXO',
    image: '/assets/items/Pantalon_01.webp',
    tech: 320,
    integrity: 300,
    type: 'legs',
    effects: [
      {
        property: 'stealth',
        value: -10,
      },
      {
        property: 'medicine',
        value: 13,
      },
    ],
  },
  {
    id: '238',
    name: 'Pantalon AXXXD',
    image: '/assets/items/Pantalon_01.webp',
    tech: 330,
    integrity: 300,
    type: 'legs',
    effects: [
      {
        property: 'robustness',
        value: 6,
      },
      {
        property: 'computing',
        value: 6,
      },
    ],
  },
  {
    id: '239',
    name: 'Bas de robe rouge',
    image: '/assets/items/Bas_robe_rouge.webp',
    tech: 300,
    integrity: 60,
    type: 'legs',
    prerequisites: [
      {
        property: 'agility',
        value: 60,
      },
    ],
  },
  {
    id: '240',
    name: 'Collants standard',
    image: '/assets/items/Collants_standard.webp',
    tech: 320,
    integrity: 75,
    type: 'legs',
    prerequisites: [
      {
        property: 'agility',
        value: 10,
      },
      {
        property: 'robustness',
        value: 20,
      },
    ],
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
    id: '241',
    name: 'Jambières Dreadball',
    image: '/assets/items/Jambieres_dreadball.webp',
    tech: 330,
    integrity: 110,
    type: 'legs',
    prerequisites: [
      {
        property: 'strength',
        value: 120,
      },
      {
        property: 'robustness',
        value: 50,
      },
    ],
    effects: [
      {
        property: 'strength',
        value: 16,
      },
      {
        property: 'agility',
        value: -4,
      },
      {
        property: 'robustness',
        value: -4,
      },
    ],
  },
  {
    id: '242',
    name: 'Jean Lev2',
    image: '/assets/items/Jean_rouge.webp',
    tech: 320,
    integrity: 80,
    type: 'legs',
    effects: [
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '243',
    name: 'Jean Lev Black',
    image: '/assets/items/Jean_noir.webp',
    tech: 320,
    integrity: 80,
    type: 'legs',
    effects: [
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '244',
    name: 'Jupe Keÿlt',
    image: '/assets/items/Jupe_keylt.webp',
    tech: 280,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'health',
        value: 15,
      },
    ],
  },
  {
    id: '245',
    name: 'Jupe Plissée',
    image: '/assets/items/Jupe_plissee.webp',
    tech: 280,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'health',
        value: 15,
      },
    ],
  },
  {
    id: '246',
    name: 'Pantalon de Costume',
    image: '/assets/items/Pantalon_costume.webp',
    tech: 350,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '247',
    name: 'Pantalon de Tailleur',
    image: '/assets/items/Pantalon_tailleur.webp',
    tech: 350,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '248',
    name: 'Pantalon de Chasseur',
    image: '/assets/items/Pantalon_chasseur.webp',
    tech: 360,
    integrity: 90,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: 3,
      },
    ],
  },
  {
    id: '249',
    name: 'Pantalon Keynes Mills',
    image: '/assets/items/Pantalon_Keynes_Mills.webp',
    tech: 360,
    integrity: 90,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 4,
      },
      {
        property: 'stealth',
        value: 3,
      },
    ],
  },
  {
    id: '250',
    name: "Pantalons d'éveil (F)",
    image: '/assets/items/Pantalon_deveil_F.webp',
    tech: 0,
    integrity: 0,
    type: 'legs',
  },
  {
    id: '251',
    name: 'Pantalon militaire',
    image: '/assets/items/Pantalon_militaire.webp',
    tech: 400,
    integrity: 90,
    type: 'legs',
  },
  {
    id: '252',
    name: 'Short Boxe Gold',
    image: '/assets/items/Short_boxe_gold.webp',
    tech: 350,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'strength',
        value: 2,
      },
      {
        property: 'agility',
        value: 2,
      },
    ],
  },
  {
    id: '253',
    name: 'Short Sport',
    image: '/assets/items/Short_sport.webp',
    tech: 350,
    integrity: 60,
    type: 'legs',
    effects: [
      {
        property: 'strength',
        value: 2,
      },
      {
        property: 'agility',
        value: 2,
      },
    ],
  },
  {
    id: '254',
    name: 'Short Hansen',
    image: '/assets/items/Short_hansen.webp',
    tech: 340,
    integrity: 65,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '255',
    name: 'Short Mahx',
    image: '/assets/items/Short_mahx.webp',
    tech: 340,
    integrity: 65,
    type: 'legs',
    effects: [
      {
        property: 'agility',
        value: 6,
      },
    ],
  },
  {
    id: '256',
    name: 'String Ecureuil',
    image: '/assets/items/Stringecureuil.webp',
    tech: 250,
    integrity: 60,
    type: 'legs',
  },
  {
    id: '257',
    name: 'Pantalon AXXXT',
    image: '/assets/items/Pantalon_01.webp',
    tech: 400,
    integrity: 300,
    type: 'legs',
  },
];
