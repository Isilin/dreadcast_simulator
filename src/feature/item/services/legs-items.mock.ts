import type { ItemResponseDto } from './item.dto';

export const MOCK_LEGS_ITEMS: ItemResponseDto[] = [
  {
    id: '200',
    name: 'Bas de robe néon',
    image: 'https://wiki.dreadcast.net/images/c/cf/Bas_de_robe_neon.png',
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
    image: 'https://wiki.dreadcast.net/images/c/c1/ASSETS_Bas_sexy_262-PX.png',
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
    image: 'https://wiki.dreadcast.net/images/7/73/Boxermoulant.png',
    tech: 250,
    integrity: 60,
    type: 'legs',
  },
  {
    id: '203',
    name: 'Collants Dermiques',
    image: 'https://wiki.dreadcast.net/images/d/d4/Collants_dermiques.png',
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
    image: 'https://wiki.dreadcast.net/images/1/13/Decker-jambe.png',
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
    image: 'https://wiki.dreadcast.net/images/c/c7/Exo_jambieres.png',
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
      'https://wiki.dreadcast.net/images/c/cf/Exo-jambieres_de_chantier.png',
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
    image: 'https://wiki.dreadcast.net/images/1/13/Gode-ceinture.png',
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
    image: 'https://wiki.dreadcast.net/images/c/cb/Jambieres_sanguinaires.png',
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
    image: 'https://wiki.dreadcast.net/images/9/96/Jambieres_runner.png',
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
    image: 'https://wiki.dreadcast.net/images/0/0b/Jambieres_tecno.png',
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
    image: 'https://wiki.dreadcast.net/images/2/2e/Jean.png',
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
    image: 'https://wiki.dreadcast.net/images/b/b9/Jupe_hansen.png',
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
    image: 'https://wiki.dreadcast.net/images/f/fb/Jupe_metal.png',
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
    image: 'https://wiki.dreadcast.net/images/9/9a/JUPE_MUXO.png',
    tech: 380,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '215',
    name: 'Jupe Muyang',
    image: 'https://wiki.dreadcast.net/images/6/60/Jupe_muyang.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f2/Minishort.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7b/Pantalon_a_poches.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f4/Pantalon_Bijela.png',
    tech: 350,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '219',
    name: 'Pantalon Cosmopolitain',
    image: 'https://wiki.dreadcast.net/images/0/03/Pantalon_cosmopolitain.png',
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
    image: 'https://wiki.dreadcast.net/images/4/40/Pantalon_cyber.png',
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
    image: 'https://wiki.dreadcast.net/images/4/40/Pantalon_cyber.png',
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
    image: 'https://wiki.dreadcast.net/images/a/ab/Pantalon_deveil_H.png',
    tech: 0,
    integrity: 0,
    type: 'legs',
  },
  {
    id: '223',
    name: 'Pantalon Eye',
    image: 'https://wiki.dreadcast.net/images/7/76/Pantalon_eye.png',
    tech: 400,
    integrity: 90,
    type: 'legs',
  },
  {
    id: '224',
    name: 'Pantalon médical',
    image: 'https://wiki.dreadcast.net/images/9/9a/Pantalon_medical.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f0/Short_abime.png',
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
    image: 'https://wiki.dreadcast.net/images/d/d2/Short_boxe.png',
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
    image: 'https://wiki.dreadcast.net/images/9/9d/Short_cyt.png',
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
    image: 'https://wiki.dreadcast.net/images/5/53/Short_standard.png',
    tech: 380,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '229',
    name: 'Slip Écureuil',
    image: 'https://wiki.dreadcast.net/images/5/55/Slip_ecureuil.png',
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
    image: 'https://wiki.dreadcast.net/images/5/5a/Stringconnecte.png',
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
    image: 'https://wiki.dreadcast.net/images/7/77/Stringsexy.png',
    tech: 250,
    integrity: 60,
    type: 'legs',
  },
  {
    id: '232',
    name: 'Jambières squelette',
    image: 'https://wiki.dreadcast.net/images/0/01/Jambieresquelette.png',
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
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
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
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
    tech: 400,
    integrity: 300,
    type: 'legs',
  },
  {
    id: '235',
    name: 'Pantalon AXXXL',
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
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
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
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
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
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
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
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
    image: 'https://wiki.dreadcast.net/images/4/4d/Bas_robe_rouge.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f1/Collants_standard.png',
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
    image: 'https://wiki.dreadcast.net/images/9/93/Jambieres_dreadball.png',
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
    image: 'https://wiki.dreadcast.net/images/2/27/Jean_rouge.png',
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
    image: 'https://wiki.dreadcast.net/images/c/c3/Jean_noir.png',
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
    image: 'https://wiki.dreadcast.net/images/3/33/Jupe_keylt.png',
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
    image: 'https://wiki.dreadcast.net/images/2/2d/Jupe_plissee.png',
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
    image: 'https://wiki.dreadcast.net/images/0/0b/Pantalon_costume.png',
    tech: 350,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '247',
    name: 'Pantalon de Tailleur',
    image: 'https://wiki.dreadcast.net/images/f/ff/Pantalon_tailleur.png',
    tech: 350,
    integrity: 70,
    type: 'legs',
  },
  {
    id: '248',
    name: 'Pantalon de Chasseur',
    image: 'https://wiki.dreadcast.net/images/7/7e/Pantalon_chasseur.png',
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
    image: 'https://wiki.dreadcast.net/images/b/b8/Pantalon_Keynes_Mills.png',
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
    image: 'https://wiki.dreadcast.net/images/e/e8/Pantalon_deveil_F.png',
    tech: 0,
    integrity: 0,
    type: 'legs',
  },
  {
    id: '251',
    name: 'Pantalon militaire',
    image: 'https://wiki.dreadcast.net/images/1/1c/Pantalon_militaire.png',
    tech: 400,
    integrity: 90,
    type: 'legs',
  },
  {
    id: '252',
    name: 'Short Boxe Gold',
    image: 'https://wiki.dreadcast.net/images/a/a5/Short_boxe_gold.png',
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
    image: 'https://wiki.dreadcast.net/images/0/00/Short_sport.png',
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
    image: 'https://wiki.dreadcast.net/images/2/29/Short_hansen.png',
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
    image: 'https://wiki.dreadcast.net/images/d/d7/Short_mahx.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f2/Stringecureuil.png',
    tech: 250,
    integrity: 60,
    type: 'legs',
  },
  {
    id: '257',
    name: 'Pantalon AXXXT',
    image: 'https://wiki.dreadcast.net/images/8/8f/Pantalon_01.png',
    tech: 400,
    integrity: 300,
    type: 'legs',
  },
];
