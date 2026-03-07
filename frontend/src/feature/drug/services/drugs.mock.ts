import type { DrugResponseDto } from './drug.dto';

export const MOCK_DRUGS: DrugResponseDto[] = [
  {
    id: '0',
    name: 'Caducée',
    image: 'http://www.dreadcast.net/images/objets/caducee.png',
    stat_modifier: [
      { property: 'medicine', value: 20 },
      { property: 'perception', value: -60 },
    ],
  },
  {
    id: '1',
    name: 'Condor',
    image: 'http://www.dreadcast.net/images/objets/condor.png',
    stat_modifier: [
      { property: 'computing', value: 20 },
      { property: 'robustness', value: -60 },
    ],
  },
  {
    id: '2',
    name: 'Filias',
    image: 'http://www.dreadcast.net/images/objets/filias.png',
    stat_modifier: [
      { property: 'stealth', value: 20 },
      { property: 'perception', value: -60 },
    ],
  },
  {
    id: '3',
    name: 'Pasorel',
    image: 'http://www.dreadcast.net/images/objets/pasorel.png',
    stat_modifier: [
      { property: 'stealth', value: 20 },
      { property: 'perception', value: -60 },
    ],
  },
  {
    id: '4',
    name: 'Arkalion',
    image: 'http://www.dreadcast.net/images/objets/arkalion.png',
    stat_modifier: [
      { property: 'perception', value: 20 },
      { property: 'robustness', value: -60 },
    ],
  },
  {
    id: '5',
    name: 'IR-2H',
    image: 'http://www.dreadcast.net/images/objets/ir2h.png',
    stat_modifier: [
      { property: 'strength', value: 20 },
      { property: 'robustness', value: -60 },
    ],
  },
  {
    id: '6',
    name: 'Tartare',
    image: 'http://www.dreadcast.net/images/objets/tartare.png',
    stat_modifier: [
      { property: 'robustness', value: 20 },
      { property: 'stealth', value: -60 },
    ],
  },
  {
    id: '7',
    name: 'Oxylion',
    image: 'http://www.dreadcast.net/images/objets/oxylion.png',
    stat_modifier: [
      { property: 'agility', value: 15 },
      { property: 'perception', value: 15 },
      { property: 'computing', value: -60 },
      { property: 'medicine', value: -60 },
      { property: 'engineering', value: -60 },
    ],
  },
  {
    id: '8',
    name: 'Vulcain',
    image: 'http://www.dreadcast.net/images/objets/vulcain.png',
    stat_modifier: [
      { property: 'strength', value: 15 },
      { property: 'agility', value: 15 },
      { property: 'computing', value: -60 },
      { property: 'medicine', value: -60 },
      { property: 'engineering', value: -60 },
    ],
  },
];
