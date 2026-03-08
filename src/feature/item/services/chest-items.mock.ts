import type { ItemResponseDto } from './item.dto';

export const MOCK_CHEST_ITEMS: ItemResponseDto[] = [
  {
    id: '100',
    name: 'Armure ancienne',
    image: '/assets/items/Armure-ancienne_HD.webp',
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
    image: '/assets/items/ARMURE_DERMIQUE_HD.webp',
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
    image: '/assets/items/Armure_dreadball.webp',
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
    image: '/assets/items/Armure_tactique_SI.webp',
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
    image: '/assets/items/Cuirasse_en_titane.webp',
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
    image: '/assets/items/Cuirasse_cristal2.webp',
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
    image: '/assets/items/ASSETS_KEVLAR_262-PX.webp',
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
    image: '/assets/items/ASU_ARMURE_MEDIC_262px.webp',
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
    image: '/assets/items/ASU_ARMURE_INGE_262px.webp',
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
    image: '/assets/items/ASU_ARMURE_INF_262px.webp',
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
    image: '/assets/items/ASU_ARMURE_COMBAT_262.webp',
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
    image: '/assets/items/Blouson_noir.webp',
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
    image: '/assets/items/COSMO2.webp',
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
    image: '/assets/items/Costume_3.webp',
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
    image: '/assets/items/Veste_de_Cérémonie.webp',
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
    image: '/assets/items/Blouson_cuir.webp',
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
    image: '/assets/items/Tailleur_Bijela.webp',
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
    image: '/assets/items/TRENCH-COAT2.webp',
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
    image: '/assets/items/Veste_muyang.webp',
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
    image: '/assets/items/Manteau_muyang.webp',
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
    image: '/assets/items/Costumebuss.webp',
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
    image: '/assets/items/Robe_rubanée.webp',
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
    image: '/assets/items/Robe_carbone.webp',
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
    image: '/assets/items/Robe_fendue.webp',
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
    image: '/assets/items/Robe-longue-haut.webp',
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
    image: '/assets/items/Soutien_gorge_connecte.webp',
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
    image: '/assets/items/Soutien_gorge_sexy.webp',
    tech: 250,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '127',
    name: "Chemise d'éveil (F)",
    image: '/assets/items/Chemise_éveil_femme.webp',
    tech: 0,
    integrity: 0,
    type: 'chest',
  },
  {
    id: '128',
    name: 'Débardeur',
    image: '/assets/items/Debardeur_homme.webp',
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
    image: '/assets/items/ASSETS_chemise_01_262-PX.webp',
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
    id: '130',
    name: 'Sweat',
    image: '/assets/items/Sweat.webp',
    tech: 400,
    integrity: 80,
    type: 'chest',
  },
  {
    id: '131',
    name: 'Tenue de Taulard',
    image: '/assets/items/Tenuetaulard.webp',
    tech: 120,
    integrity: 15,
    type: 'chest',
  },
  {
    id: '132',
    name: 'Tenue de Prisonnier',
    image: '/assets/items/34tenue_prisonnier.webp',
    tech: 320,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '133',
    name: 'Veste Médicale (H)',
    image: '/assets/items/medecin-torse-homme.webp',
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
    image: '/assets/items/Blouse.webp',
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
    image: '/assets/items/COSTUME_HACKER_262px.webp',
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
    image: '/assets/items/exosquelette-torse-homme.webp',
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
    image: '/assets/items/COMBINAISON_TECH-4.webp',
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
    image: '/assets/items/CombiTECH5.webp',
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
    image: '/assets/items/Uniforme-police.webp',
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
    image: '/assets/items/Armure-techno.webp',
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
    image: '/assets/items/Combinaisonsquelette.webp',
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
    image: '/assets/items/Armure_A300.webp',
    tech: 350,
    integrity: 300,
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
    image: '/assets/items/Armure_A300.webp',
    tech: 400,
    integrity: 300,
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
    image: '/assets/items/Armure_A300.webp',
    tech: 400,
    integrity: 300,
    type: 'chest',
  },
  {
    id: '145',
    name: 'Armure AXXXL',
    image: '/assets/items/Armure_A300.webp',
    tech: 360,
    integrity: 300,
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
    image: '/assets/items/Armure_A300.webp',
    tech: 340,
    integrity: 300,
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
    image: '/assets/items/Armure_A300.webp',
    tech: 320,
    integrity: 300,
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
    image: '/assets/items/Armure_A300.webp',
    tech: 320,
    integrity: 300,
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
    image: '/assets/items/CHEMISE_262px.webp',
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
    image: '/assets/items/blouson_bleu.webp',
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
    image: '/assets/items/blouson_rouge.webp',
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
    image: '/assets/items/blouson_vert.webp',
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
    image: '/assets/items/Veste_décontractée.webp',
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
    image: '/assets/items/trench_marron.webp',
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
    image: '/assets/items/trench_gris.webp',
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
    image: '/assets/items/trench_bleu.webp',
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
    image: '/assets/items/manteau_fourrure_1.webp',
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
    image: '/assets/items/manteau_fourrure_2.webp',
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
    image: '/assets/items/Vestecuir_radioactive_homme.webp',
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
    image: '/assets/items/Vestecuir_radioactive_femme.webp',
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
    image: '/assets/items/Costume_femme.webp',
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
    image: '/assets/items/Blouson_motard.webp',
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
    image: '/assets/items/Blouson_cuir-rouge.webp',
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
    image: '/assets/items/Groscuir.webp',
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
    image: '/assets/items/Robe_sexy-1-noire.webp',
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
    image: '/assets/items/Robe-class-or-haut.webp',
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
    image: '/assets/items/Mini_Robe.webp',
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
    image: '/assets/items/Soutiengorgeecureuil.webp',
    tech: 250,
    integrity: 60,
    type: 'chest',
  },
  {
    id: '169',
    name: "Chemise d'éveil (M)",
    image: '/assets/items/Chemise_éveil_homme.webp',
    tech: 0,
    integrity: 0,
    type: 'chest',
  },
  {
    id: '170',
    name: 'Débardeur Femme',
    image: '/assets/items/DEBARDEUR_FEMME.webp',
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
    image: '/assets/items/Debardeur_rascal.webp',
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
    image: '/assets/items/Squidzilla.webp',
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
    image: '/assets/items/Ccom.webp',
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
    image: '/assets/items/Utopia.webp',
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
    image: '/assets/items/D-engrenage.webp',
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
    image: '/assets/items/Otis.webp',
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
    image: '/assets/items/Debardeur_pi.webp',
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
    image: '/assets/items/Debardeur_onix.webp',
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
    image: '/assets/items/Debardeur_senechal.webp',
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
    image: '/assets/items/T-shirt_dreadball.webp',
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
    image: '/assets/items/T-shirt_dreadball_femme.webp',
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
    image: '/assets/items/Tshirt_de_grand_fan.webp',
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
    image: '/assets/items/DEBARDEUR_LONG.webp',
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
    image: '/assets/items/medecin-torse-femme.webp',
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
    image: '/assets/items/decker-torse-homme.webp',
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
    image: '/assets/items/decker-torse-femme.webp',
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
    image: '/assets/items/exosquelette-torse-femme.webp',
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
    image: '/assets/items/Mecano-torse_homme.webp',
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
    image: '/assets/items/Mecano-torse-femme.webp',
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
    image: '/assets/items/T-SHIRT-FAN262.webp',
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
    image: '/assets/items/Armure_tactique_SR.webp',
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
    image: '/assets/items/Uniforme_de_frelon.webp',
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
    image: '/assets/items/Blouson_cuir-rouge.webp',
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
