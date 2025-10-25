import type { ItemResponseDto } from './item.dto';

export const MOCK_CHEST_ITEMS: ItemResponseDto[] = [
  {
    id: '100',
    name: 'Armure ancienne',
    image: 'https://wiki.dreadcast.net/images/8/88/Armure-ancienne_HD.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 120,
      },
      {
        property: 'robustness',
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
    image: 'https://wiki.dreadcast.net/images/1/19/ARMURE_DERMIQUE_HD.png',
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
    image: 'https://wiki.dreadcast.net/images/1/19/Armure_dreadball.png',
    tech: 330,
    integrity: 135,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 105,
      },
      {
        property: 'robustness',
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
    image: 'https://wiki.dreadcast.net/images/4/4c/Armure_tactique_SI.png',
    tech: 300,
    integrity: 135,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 105,
      },
      {
        property: 'robustness',
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
        property: 'strength',
        value: 120,
      },
      {
        property: 'robustness',
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
    image: 'https://wiki.dreadcast.net/images/9/91/Cuirasse_cristal2.png',
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
    image: 'https://wiki.dreadcast.net/images/d/d4/ASSETS_KEVLAR_262-PX.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
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
        value: 10,
      },
    ],
  },
  {
    id: '107',
    name: 'Armure ø-MED-001',
    image: 'https://wiki.dreadcast.net/images/e/ec/ASU_ARMURE_MEDIC_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/7/7a/ASU_ARMURE_INGE_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/4/44/ASU_ARMURE_INF_262px.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f9/ASU_ARMURE_COMBAT_262.png',
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
    name: 'Blouson noir',
    image: 'https://wiki.dreadcast.net/images/2/2a/Blouson_noir.png',
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
    name: 'Cosmo',
    image: 'https://www.dreadcast.net/images/objets/COSMO2.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '113',
    name: 'Costume',
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
    name: 'Veste en cuir',
    image: 'https://wiki.dreadcast.net/images/6/6b/Blouson_cuir.png',
    tech: 350,
    integrity: 120,
    type: 'chest',
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
    image: 'https://wiki.dreadcast.net/images/1/13/TRENCH-COAT2.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [
      {
        property: 'robustness',
        value: 60,
      },
      {
        property: 'stealth',
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
    image: 'https://wiki.dreadcast.net/images/9/95/Costumebuss.png',
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
    image: 'https://wiki.dreadcast.net/images/b/bf/Robe_carbone.png',
    tech: 350,
    integrity: 150,
    type: 'chest',
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
        value: 10,
      },
    ],
  },
  {
    id: '123',
    name: 'Robe fendue',
    image: 'https://wiki.dreadcast.net/images/a/a7/Robe_fendue.png',
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
    name: 'Haut de Robe rouge',
    image: 'https://wiki.dreadcast.net/images/5/58/Robe-longue-haut.png',
    tech: 300,
    integrity: 60,
    type: 'chest',
    prerequisites: [
      {
        property: 'agility',
        value: 60,
      },
    ],
  },
  {
    id: '125',
    name: 'Soutien Gorge connecté',
    image: 'https://wiki.dreadcast.net/images/d/dd/Soutien_gorge_connecte.png',
    tech: 400,
    integrity: 100,
    type: 'chest',
    prerequisites: [
      {
        property: 'computing',
        value: 50,
      },
    ],
  },
  {
    id: '126',
    name: 'Soutien Gorge sexy',
    image: 'https://wiki.dreadcast.net/images/3/38/Soutien_gorge_sexy.png',
    tech: 250,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '127',
    name: "Chemise d'éveil (F)",
    image:
      'https://wiki.dreadcast.net/images/a/ac/Chemise_%C3%A9veil_femme.png',
    tech: 0,
    integrity: 0,
    type: 'chest',
  },
  {
    id: '128',
    name: 'Débardeur',
    image: 'https://wiki.dreadcast.net/images/4/4b/Debardeur_homme.png',
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
    name: 'Chemisier',
    image:
      'https://www.dreadcast.net/images/objets/ASSETS_chemise_01_262-PX.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '130',
    name: 'Sweat',
    image: 'https://wiki.dreadcast.net/images/b/bc/Sweat.png',
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
    image: 'https://wiki.dreadcast.net/images/f/f0/34tenue_prisonnier.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '133',
    name: 'Veste Médicale (H)',
    image: 'https://www.dreadcast.net/images/objets/medecin-torse-homme.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
    prerequisites: [{ property: 'medicine', value: 30 }],
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
    name: 'Cyber Veste',
    image: 'https://wiki.dreadcast.net/images/a/a0/COSTUME_HACKER_262px.png',
    tech: 320,
    integrity: 90,
    type: 'chest',
    prerequisites: [{ property: 'computing', value: 30 }],
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
    name: 'Exo Buste de Chantier (H)',
    image:
      'https://www.dreadcast.net/images/objets/exosquelette-torse-homme.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [{ property: 'engineering', value: 30 }],
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
    image: 'https://www.dreadcast.net/images/objets/COMBINAISON_TECH-4.png',
    tech: 200,
    integrity: 100,
    type: 'chest',
    prerequisites: [{ property: 'engineering', value: 150 }],
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
    image: 'https://wiki.dreadcast.net/images/4/44/Combinaisonsquelette.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
    tech: 200,
    integrity: 400,
    type: 'chest',
  },
  {
    id: '145',
    name: 'Armure AXXXL',
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
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
    image: 'https://wiki.dreadcast.net/images/e/ef/Armure_A300.png',
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
  {
    id: '149',
    name: 'Chemise',
    image: 'https://www.dreadcast.net/images/objets/CHEMISE_262px.png',
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
    id: '150',
    name: 'Blouson bleu',
    image: 'https://www.dreadcast.net/images/objets/blouson_bleu.png',
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
    id: '151',
    name: 'Blouson rouge',
    image: 'https://www.dreadcast.net/images/objets/blouson_rouge.png',
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
    id: '152',
    name: 'Blouson vert',
    image: 'https://www.dreadcast.net/images/objets/blouson_vert.png',
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
    id: '153',
    name: 'Veste décontractée',
    image:
      'https://wiki.dreadcast.net/images/4/44/Veste_d%C3%A9contract%C3%A9e.png',
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
    id: '154',
    name: 'Cosmopolitain',
    image: 'https://www.dreadcast.net/images/objets/trench_marron.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '155',
    name: 'Cosmo étanche',
    image: 'https://www.dreadcast.net/images/objets/trench_gris.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '156',
    name: 'Cosmo velour',
    image: 'https://www.dreadcast.net/images/objets/trench_bleu.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '157',
    name: 'Manteau Anapurnol bleu',
    image: 'https://www.dreadcast.net/images/objets/manteau_fourrure_1.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '158',
    name: 'Manteau Anapurnol',
    image: 'https://www.dreadcast.net/images/objets/manteau_fourrure_2.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '159',
    name: "Veste Rad' (M)",
    image:
      'https://wiki.dreadcast.net/images/8/81/Vestecuir_radioactive_homme.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '160',
    name: "Veste Rad' (F)",
    image:
      'https://wiki.dreadcast.net/images/8/8d/Vestecuir_radioactive_femme.png',
    tech: 400,
    integrity: 110,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 50,
      },
      {
        property: 'agility',
        value: 50,
      },
    ],
  },
  {
    id: '161',
    name: 'Tailleur',
    image: 'https://wiki.dreadcast.net/images/4/4b/Costume_femme.png',
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
    id: '162',
    name: 'Veste en cuir noir',
    image: 'https://wiki.dreadcast.net/images/e/ef/Blouson_motard.png',
    tech: 350,
    integrity: 120,
    type: 'chest',
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
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '163',
    name: 'Veste en cuir rouge',
    image: 'https://wiki.dreadcast.net/images/0/03/Blouson_cuir-rouge.png',
    tech: 350,
    integrity: 120,
    type: 'chest',
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
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '164',
    name: 'Gros cuir',
    image: 'https://wiki.dreadcast.net/images/4/45/Groscuir.png',
    tech: 350,
    integrity: 120,
    type: 'chest',
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
        property: 'robustness',
        value: 5,
      },
    ],
  },
  {
    id: '165',
    name: 'Robe noire',
    image: 'https://wiki.dreadcast.net/images/8/86/Robe_sexy-1-noire.png',
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
    id: '166',
    name: 'Haut de Robe néon',
    image: 'https://wiki.dreadcast.net/images/3/3b/Robe-class-or-haut.png',
    tech: 300,
    integrity: 60,
    type: 'chest',
    prerequisites: [
      {
        property: 'agility',
        value: 60,
      },
    ],
  },
  {
    id: '167',
    name: 'Mini Robe',
    image: 'https://wiki.dreadcast.net/images/6/66/Mini_Robe.png',
    tech: 300,
    integrity: 60,
    type: 'chest',
    prerequisites: [
      {
        property: 'agility',
        value: 60,
      },
    ],
  },
  {
    id: '168',
    name: 'Soutien Gorge Écureuil',
    image: 'https://wiki.dreadcast.net/images/8/8f/Soutiengorgeecureuil.png',
    tech: 250,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '169',
    name: "Chemise d'éveil (M)",
    image:
      'https://wiki.dreadcast.net/images/9/99/Chemise_%C3%A9veil_homme.png',
    tech: 0,
    integrity: 0,
    type: 'chest',
  },
  {
    id: '170',
    name: 'Débardeur Femme',
    image: 'https://wiki.dreadcast.net/images/4/47/DEBARDEUR_FEMME.png',
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
    id: '171',
    name: 'Débardeur Rascal',
    image: 'https://wiki.dreadcast.net/images/8/8c/Debardeur_rascal.png',
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
    id: '172',
    name: 'Débardeur Squidzilla',
    image: 'https://wiki.dreadcast.net/images/e/e7/Squidzilla.png',
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
    id: '173',
    name: 'Débardeur C.Com',
    image: 'https://wiki.dreadcast.net/images/3/3c/Ccom.png',
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
    id: '174',
    name: 'Débardeur Utopia',
    image: 'https://wiki.dreadcast.net/images/d/d2/Utopia.png',
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
    id: '175',
    name: 'Débardeur Engrenage',
    image: 'https://wiki.dreadcast.net/images/c/c6/D-engrenage.png',
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
    id: '176',
    name: 'Débardeur Otis',
    image: 'https://wiki.dreadcast.net/images/d/d7/Otis.png',
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
    id: '177',
    name: 'Débardeur 3.14',
    image: 'https://wiki.dreadcast.net/images/9/9b/Debardeur_pi.png',
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
    id: '178',
    name: 'Débardeur Onix',
    image: 'https://wiki.dreadcast.net/images/5/5d/Debardeur_onix.png',
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
    id: '179',
    name: 'Débardeur Sénéchal',
    image: 'https://wiki.dreadcast.net/images/8/8b/Debardeur_senechal.png',
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
    id: '180',
    name: 'T-shirt de Dreadball (H)',
    image: 'https://wiki.dreadcast.net/images/4/40/T-shirt_dreadball.png',
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
    id: '181',
    name: 'T-shirt de Dreadball (F)',
    image: 'https://wiki.dreadcast.net/images/a/ad/T-shirt_dreadball_femme.png',
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
    id: '182',
    name: 'T-shirt de grand fan',
    image: 'https://wiki.dreadcast.net/images/a/ab/Tshirt_de_grand_fan.png',
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
    id: '183',
    name: 'Débardeur long',
    image: 'https://wiki.dreadcast.net/images/7/76/DEBARDEUR_LONG.png',
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
    id: '184',
    name: 'Veste Médicale (F)',
    image: 'https://www.dreadcast.net/images/objets/medecin-torse-femme.png',
    tech: 320,
    integrity: 60,
    type: 'chest',
    prerequisites: [{ property: 'medicine', value: 30 }],
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
    id: '185',
    name: 'Cyber-Veste (H)',
    image: 'https://www.dreadcast.net/images/objets/decker-torse-homme.png',
    tech: 320,
    integrity: 90,
    type: 'chest',
    prerequisites: [{ property: 'computing', value: 30 }],
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
    id: '186',
    name: 'Cyber-Veste (F)',
    image: 'https://www.dreadcast.net/images/objets/decker-torse-femme.png',
    tech: 320,
    integrity: 90,
    type: 'chest',
    prerequisites: [{ property: 'computing', value: 30 }],
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
    id: '187',
    name: 'Exo Buste de Chantier (F)',
    image:
      'https://www.dreadcast.net/images/objets/exosquelette-torse-femme.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [{ property: 'engineering', value: 30 }],
    effects: [
      {
        property: 'engineering',
        value: 4,
      },
    ],
  },
  {
    id: '188',
    name: 'Veste à Poches (H)',
    image: 'https://wiki.dreadcast.net/images/5/57/Mecano-torse_homme.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [{ property: 'engineering', value: 30 }],
    effects: [
      {
        property: 'engineering',
        value: 4,
      },
    ],
  },
  {
    id: '189',
    name: 'Veste à Poches (F)',
    image: 'https://wiki.dreadcast.net/images/4/47/Mecano-torse-femme.png',
    tech: 360,
    integrity: 120,
    type: 'chest',
    prerequisites: [{ property: 'engineering', value: 30 }],
    effects: [
      {
        property: 'engineering',
        value: 4,
      },
    ],
  },
  {
    id: '190',
    name: 'T-shirt de fan',
    image: 'https://wiki.dreadcast.net/images/6/6f/T-SHIRT-FAN262.png',
    tech: 350,
    integrity: 60,
    type: 'chest',
    effects: [
      {
        property: 'agility',
        value: 5,
      },
    ],
  },
  {
    id: '191',
    name: 'Armure tactique SR',
    image: 'https://wiki.dreadcast.net/images/8/84/Armure_tactique_SR.png',
    tech: 300,
    integrity: 135,
    type: 'chest',
    prerequisites: [
      {
        property: 'strength',
        value: 105,
      },
      {
        property: 'robustness',
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
    id: '192',
    name: 'Uniforme de frelon',
    image: 'https://wiki.dreadcast.net/images/a/af/Uniforme_de_frelon.png',
    tech: 0,
    integrity: 300,
    type: 'chest',
    effects: [
      {
        property: 'robustness',
        value: 30,
      },
      {
        property: 'health',
        value: 30,
      },
      {
        property: 'engineering',
        value: 30,
      },
      {
        property: 'stealth',
        value: -30,
      },
    ],
  },
  {
    id: '193',
    name: 'Cuir Rouge',
    image: 'https://wiki.dreadcast.net/images/0/03/Blouson_cuir-rouge.png',
    tech: 350,
    integrity: 100,
    type: 'chest',
    prerequisites: [
      { property: 'agility', value: 10 },
      { property: 'robustness', value: 20 },
    ],
    effects: [
      {
        property: 'robustness',
        value: 5,
      },
    ],
  },
];
