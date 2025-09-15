import type { ItemResponseDto } from './item.dto';

export const MOCK_CHEST_ITEMS: ItemResponseDto[] = [
  {
    id: '100',
    name: 'Armure ancienne',
    image:
      'https://wiki.dreadcast.net/images/thumb/8/88/Armure-ancienne_HD.png/50px-Armure-ancienne_HD.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 120,
      },
      {
        skill: 'robustness',
        value: 120,
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
        value: 10,
      },
    ],
  },
  {
    id: '101',
    name: 'Armure dermique',
    image:
      'https://wiki.dreadcast.net/images/thumb/1/19/ARMURE_DERMIQUE_HD.png/50px-ARMURE_DERMIQUE_HD.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 5,
      },
      {
        property: 'agility',
        value: 3,
      },
    ],
  },
  {
    id: '102',
    name: 'Armure de dreadball',
    image:
      'https://wiki.dreadcast.net/images/thumb/1/19/Armure_dreadball.png/100px-Armure_dreadball.png',
    tech: 330,
    integrity: 135,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 105,
      },
      {
        skill: 'robustness',
        value: 105,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 15,
      },
      {
        property: 'agility',
        value: -5,
      },
    ],
  },
  {
    id: '103',
    name: 'Armure tactique SI',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/4c/Armure_tactique_SI.png/50px-Armure_tactique_SI.png',
    tech: 300,
    integrity: 135,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 105,
      },
      {
        skill: 'robustness',
        value: 105,
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
    id: '104',
    name: 'Cuirasse',
    image: 'https://wiki.dreadcast.net/images/1/10/Cuirasse_en_titane.png',
    tech: 400,
    integrity: 250,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 120,
      },
      {
        skill: 'robustness',
        value: 160,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 25,
      },
      {
        property: 'agility',
        value: -15,
      },
    ],
  },
  {
    id: '105',
    name: 'Cuirasse en cristal',
    image:
      'https://wiki.dreadcast.net/images/thumb/9/91/Cuirasse_cristal2.png/100px-Cuirasse_cristal2.png',
    tech: 380,
    integrity: 220,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 20,
      },
      {
        property: 'agility',
        value: -10,
      },
    ],
  },
  {
    id: '106',
    name: 'Kevlar',
    image:
      'https://wiki.dreadcast.net/images/thumb/d/d4/ASSETS_KEVLAR_262-PX.png/100px-ASSETS_KEVLAR_262-PX.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 60,
      },
      {
        skill: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 10,
      },
    ],
  },
  {
    id: '107',
    name: 'Armure ø-MED-001',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ec/ASU_ARMURE_MEDIC_262px.png/100px-ASU_ARMURE_MEDIC_262px.png',
    tech: 320,
    integrity: 180,
    type: 'chest',
    effects: [
      {
        property: 'medicine',
        value: 24,
      },
      {
        property: 'stealth',
        value: -12,
      },
    ],
  },
  {
    id: '108',
    name: 'Armure ø-ING-001',
    image:
      'https://wiki.dreadcast.net/images/thumb/7/7a/ASU_ARMURE_INGE_262px.png/100px-ASU_ARMURE_INGE_262px.png',
    tech: 360,
    integrity: 200,
    type: 'chest',
    effects: [
      {
        property: 'engineering',
        value: 14,
      },
    ],
  },
  {
    id: '109',
    name: 'Armure ø-INF-001',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/44/ASU_ARMURE_INF_262px.png/100px-ASU_ARMURE_INF_262px.png',
    tech: 320,
    integrity: 220,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 18,
      },
    ],
  },
  {
    id: '110',
    name: 'Armure ø-FO-001',
    image:
      'https://wiki.dreadcast.net/images/thumb/f/f9/ASU_ARMURE_COMBAT_262.png/100px-ASU_ARMURE_COMBAT_262.png',
    tech: 350,
    integrity: 200,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 15,
      },
      {
        property: 'agility',
        value: 3,
      },
    ],
  },
  {
    id: '111',
    name: 'Blouson noir/bleu/rouge/vert/Veste décontractée',
    image: 'https://wiki.dreadcast.net/images/b/b9/Blouson_bleu.png',
    tech: 350,
    integrity: 100,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
    ],
  },
  {
    id: '112',
    name: "Cosmo/Cosmopolitain/Cosmopolitain étanche/Cosmopolitain velour/Anapurnol bleu/Anapurnol marron/Veste Rad' (R)/Veste Rad' (F)",
    image:
      'https://wiki.dreadcast.net/images/thumb/8/8c/COSMO2.png/100px-COSMO2.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 50,
      },
      {
        skill: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '113',
    name: 'Costume/Tailleur',
    image: 'https://wiki.dreadcast.net/images/e/e0/Costume_3.png',
    tech: 200,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 15,
      },
    ],
  },
  {
    id: '114',
    name: 'Veste de cérémonie',
    image:
      'https://wiki.dreadcast.net/images/5/50/Veste_de_C%C3%A9r%C3%A9monie.png',
    tech: 320,
    integrity: 80,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: -4,
      },
      {
        property: 'agility',
        value: 10,
      },
    ],
  },
  {
    id: '115',
    name: 'Veste en cuir/noir/rouge/Gros cuir',
    image: 'https://wiki.dreadcast.net/images/6/6b/Blouson_cuir.png',
    tech: 350,
    integrity: 120,
    type: 'chest',
    prerequisites: [
      {
        skill: 'agility',
        value: 10,
      },
      {
        skill: 'robustness',
        value: 20,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '116',
    name: 'Tailleur Bijela',
    image: 'https://wiki.dreadcast.net/images/2/23/Tailleur_Bijela.png',
    tech: 200,
    integrity: 90,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 15,
      },
    ],
  },
  {
    id: '117',
    name: 'Trench-coat',
    image:
      'https://wiki.dreadcast.net/images/thumb/1/13/TRENCH-COAT2.png/100px-TRENCH-COAT2.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [
      {
        skill: 'robustness',
        value: 60,
      },
      {
        skill: 'stealth',
        value: 30,
      },
    ],
    effects: [
      {
        property: 'robustness',
        value: 4,
      },
      {
        property: 'stealth',
        value: 4,
      },
    ],
  },
  {
    id: '118',
    name: 'Veste Muyang',
    image: 'https://wiki.dreadcast.net/images/3/31/Veste_muyang.png',
    tech: 250,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'health',
        value: 12,
      },
      {
        property: 'stealth',
        value: -12,
      },
    ],
  },
  {
    id: '119',
    name: 'Manteau Muyang',
    image: 'https://wiki.dreadcast.net/images/6/63/Manteau_muyang.png',
    tech: 350,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'stealth',
        value: -12,
      },
    ],
  },
  {
    id: '120',
    name: 'Costume Buss',
    image:
      'https://wiki.dreadcast.net/images/thumb/9/95/Costumebuss.png/100px-Costumebuss.png',
    tech: 200,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 15,
      },
    ],
  },
  {
    id: '121',
    name: 'Robe rubanée',
    image: 'https://wiki.dreadcast.net/images/2/20/Robe_ruban%C3%A9e.png',
    tech: 350,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'stealth',
        value: -10,
      },
    ],
  },
  {
    id: '122',
    name: 'Robe carbone',
    image:
      'https://wiki.dreadcast.net/images/thumb/b/bf/Robe_carbone.png/100px-Robe_carbone.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
    prerequisites: [
      {
        skill: 'strength',
        value: 60,
      },
      {
        skill: 'robustness',
        value: 60,
      },
    ],
    effects: [
      {
        property: 'stealth',
        value: -10,
      },
    ],
  },
  {
    id: '123',
    name: 'Robe fendue/Robe noire',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a7/Robe_fendue.png/100px-Robe_fendue.png',
    tech: 250,
    integrity: 65,
    type: 'chest',
    effects: [
      {
        property: 'health',
        value: 12,
      },
      {
        property: 'stealth',
        value: -10,
      },
    ],
  },
  {
    id: '124',
    name: 'Haut de Robe rouge/Haut de Robe néon/Mini Robe',
    image:
      'https://wiki.dreadcast.net/images/thumb/5/58/Robe-longue-haut.png/100px-Robe-longue-haut.png',
    tech: 300,
    integrity: 60,
    type: 'chest',
    prerequisites: [
      {
        skill: 'agility',
        value: 60,
      },
    ],
  },
  {
    id: '125',
    name: 'Soutien Gorge connecté',
    image:
      'https://wiki.dreadcast.net/images/thumb/d/dd/Soutien_gorge_connecte.png/100px-Soutien_gorge_connecte.png',
    tech: 400,
    integrity: 100,
    type: 'chest',
    prerequisites: [
      {
        skill: 'computing',
        value: 50,
      },
    ],
  },
  {
    id: '126',
    name: 'Soutien Gorge sexy/Écureuil',
    image:
      'https://wiki.dreadcast.net/images/thumb/3/38/Soutien_gorge_sexy.png/100px-Soutien_gorge_sexy.png',
    tech: 250,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '127',
    name: "Chemise d'éveil",
    image:
      'https://wiki.dreadcast.net/images/thumb/a/ac/Chemise_%C3%A9veil_femme.png/100px-Chemise_%C3%A9veil_femme.png',
    tech: 0,
    integrity: 0,
    type: 'chest',
  },
  {
    id: '128',
    name: 'Débardeur/Débardeur Femme/Rascal/Squidzilla/C.Com/Utopia/Engrenage/Otis/3.14/Onix/Sénéchal/T-shirt de Dreadball (H)/T-shirt de Dreadball (F)/T-shirt de grand fan/ Débardeur long',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/4b/Debardeur_homme.png/100px-Debardeur_homme.png',
    tech: 350,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
      {
        property: 'robustness',
        value: -5,
      },
    ],
  },
  {
    id: '129',
    name: 'Chemise Homme/Chemisier',
    image:
      'https://wiki.dreadcast.net/images/thumb/9/95/Chemise_femme.png/100px-Chemise_femme.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '130',
    name: 'Sweat',
    image:
      'https://wiki.dreadcast.net/images/thumb/b/bc/Sweat.png/100px-Sweat.png',
    tech: 400,
    integrity: 80,
    type: 'chest',
  },
  {
    id: '131',
    name: 'Tenue de Taulard',
    image: 'https://wiki.dreadcast.net/images/b/bb/Tenuetaulard.png',
    tech: 120,
    integrity: 15,
    type: 'chest',
  },
  {
    id: '132',
    name: 'Tenue de Prisonnier',
    image:
      'https://wiki.dreadcast.net/images/thumb/f/f0/34tenue_prisonnier.png/100px-34tenue_prisonnier.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '133',
    name: 'Veste Médicale (H)/(F)',
    image:
      'https://wiki.dreadcast.net/images/thumb/6/61/Medecin-torse-homme.png/100px-Medecin-torse-homme.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
    prerequisites: [{ skill: 'medicine', value: 30 }],
    effects: [
      {
        property: 'stealth',
        value: -12,
      },
      {
        property: 'medicine',
        value: 14,
      },
    ],
  },
  {
    id: '134',
    name: 'Blouse Blanche',
    image: 'https://wiki.dreadcast.net/images/a/a9/Blouse.png',
    tech: 250,
    integrity: 80,
    type: 'chest',
    effects: [
      {
        property: 'medicine',
        value: 6,
      },
      {
        property: 'stamina',
        value: 10,
      },
    ],
  },
  {
    id: '135',
    name: 'Cyber-Veste (H)/(F)/Cyber Veste',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a0/COSTUME_HACKER_262px.png/100px-COSTUME_HACKER_262px.png',
    tech: 320,
    integrity: 90,
    type: 'chest',
    prerequisites: [{ skill: 'computing', value: 30 }],
    effects: [
      {
        property: 'agility',
        value: 8,
      },
      {
        property: 'computing',
        value: 8,
      },
    ],
  },
  {
    id: '136',
    name: 'Exo Buste de Chantier (H)/(F)/Veste à Poches',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a9/Exosquelette-torse-homme.png/100px-Exosquelette-torse-homme.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [{ skill: 'engineering', value: 30 }],
    effects: [
      {
        property: 'engineering',
        value: 4,
      },
    ],
  },
  {
    id: '137',
    name: 'Combinaison TECH4',
    image:
      'https://wiki.dreadcast.net/images/thumb/a/a9/Exosquelette-torse-homme.png/100px-Exosquelette-torse-homme.png',
    tech: 200,
    integrity: 100,
    type: 'chest',
    prerequisites: [{ skill: 'engineering', value: 150 }],
    effects: [
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'perception',
        value: -5,
      },
      {
        property: 'stealth',
        value: -5,
      },
      {
        property: 'engineering',
        value: 20,
      },
    ],
  },
  {
    id: '138',
    name: 'Combinaison TECH5',
    image: 'https://wiki.dreadcast.net/images/5/5a/CombiTECH5.png',
    tech: 200,
    integrity: 150,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: -5,
      },
      {
        property: 'perception',
        value: -5,
      },
      {
        property: 'stealth',
        value: -5,
      },
      {
        property: 'engineering',
        value: 20,
      },
    ],
  },
  {
    id: '139',
    name: 'Uniforme de police',
    image: 'https://wiki.dreadcast.net/images/3/3c/Uniforme-police.png',
    tech: 0,
    integrity: 300,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 30,
      },
      {
        property: 'computing',
        value: 30,
      },
      {
        property: 'stamina',
        value: 30,
      },
      {
        property: 'stealth',
        value: -30,
      },
    ],
  },
  {
    id: '140',
    name: 'Armure technologique',
    image: 'https://wiki.dreadcast.net/images/6/61/Armure-techno.png',
    tech: 400,
    integrity: 120,
    type: 'chest',
    effects: [
      {
        property: 'computing',
        value: 10,
      },
      {
        property: 'stealth',
        value: -10,
      },
    ],
  },
  {
    id: '141',
    name: 'Combinaison Squelette',
    image:
      'https://wiki.dreadcast.net/images/thumb/4/44/Combinaisonsquelette.png/100px-Combinaisonsquelette.png',
    tech: 400,
    integrity: 130,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 4,
      },
      {
        property: 'agility',
        value: -2,
      },
      {
        property: 'robustness',
        value: 4,
      },
    ],
  },
  {
    id: '142',
    name: 'Armure AXXXN',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 350,
    type: 'chest',
    effects: [
      {
        property: 'strength',
        value: 5,
      },
      {
        property: 'agility',
        value: 3,
      },
    ],
  },
  {
    id: '143',
    name: 'Armure AXXXP',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 400,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: -15,
      },
      {
        property: 'strength',
        value: 25,
      },
    ],
  },
  {
    id: '144',
    name: 'Armure AXXXT',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 400,
    type: 'chest',
  },
  {
    id: '145',
    name: 'Armure AXXXL',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 360,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 4,
      },
      {
        property: 'stealth',
        value: 4,
      },
    ],
  },
  {
    id: '146',
    name: 'Armure AXXXJ',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 340,
    type: 'chest',
    effects: [
      {
        property: 'engineering',
        value: 4,
      },
    ],
  },
  {
    id: '147',
    name: 'Armure AXXXO',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 320,
    type: 'chest',
    effects: [
      {
        property: 'stealth',
        value: -12,
      },
      {
        property: 'medicine',
        value: 14,
      },
    ],
  },
  {
    id: '148',
    name: 'Armure AXXXD',
    image:
      'https://wiki.dreadcast.net/images/thumb/e/ef/Armure_A300.png/100px-Armure_A300.png',
    tech: 200,
    integrity: 320,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 8,
      },
      {
        property: 'computing',
        value: 8,
      },
    ],
  },
];
