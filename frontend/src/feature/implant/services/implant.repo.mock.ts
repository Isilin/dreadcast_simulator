import type { ImplantResponseDto } from './implant.dto';
import { toDomain } from './implant.mapper';
import { implantArrayResponseSchema } from './implant.schema';

import type { Implant } from '@/feature/implant';
import { sleep } from '@/utils/sleep';

const MOCK_IMPLANTS: ImplantResponseDto[] = [
  {
    name: 'Génie',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Réplicateur',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Sain et sauf',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Chameau',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Monsieur Clone',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Geek',
    attributes: ['computing'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Chanceux',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Raciste',
    attributes: ['race_damage'],
    valuePerLevel: [0.01, 0.02, 0.03, 0.04, 0.05],
  },
  {
    name: 'Urgentiste',
    attributes: ['medicine'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Prestidigitateur',
    attributes: ['agility'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Flash Gordon',
    attributes: ['speed'],
    valuePerLevel: [1, 2],
  },
  {
    name: 'Inépuisable',
    attributes: ['stamina'],
    valuePerLevel: [39, 77, 114, 150, 185, 219, 252, 284, 315, 408],
  },
  {
    name: "Peau d'argent",
    attributes: ['robustness'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Ingénieur',
    attributes: ['engineering'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Brute',
    attributes: ['strength'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Rôdeur',
    attributes: ['stealth'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: "Peau d'acier",
    attributes: ['health'],
    valuePerLevel: [29, 57, 84, 110, 135, 159, 182, 204, 225, 245],
  },
  {
    name: 'La Main Bleue',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Éclaireur',
    attributes: ['hit_rating'],
    valuePerLevel: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2],
  },
  {
    name: 'Je te vois',
    attributes: ['perception'],
    valuePerLevel: [5, 10, 15, 20, 25, 30, 35, 40, 50, 60],
  },
  {
    name: 'Scientifique',
    attributes: ['medicine', 'computing', 'engineering'],
    valuePerLevel: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60],
  },
  {
    name: 'Économe',
    attributes: [],
    valuePerLevel: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: 'Félin',
    attributes: ['perception', 'stealth'],
    valuePerLevel: [6, 12, 18, 24, 30, 36, 42, 48, 54, 60],
  },
  {
    name: 'Aide de camp',
    attributes: ['team_heal'],
    valuePerLevel: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.2],
  },
  {
    name: 'Commando',
    attributes: ['critical_cac_chance'],
    valuePerLevel: [
      0.005, 0.01, 0.015, 0.02, 0.025, 0.03, 0.035, 0.04, 0.045, 0.05,
    ],
  },
  {
    name: 'Ninja',
    attributes: ['cac_damage'],
    valuePerLevel: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18],
  },
  {
    name: 'Polyvalent',
    attributes: [
      'strength',
      'agility',
      'robustness',
      'perception',
      'stealth',
      'computing',
      'medicine',
      'engineering',
    ],
    valuePerLevel: [3, 6, 9, 12, 15, 18, 21, 24, 27],
  },
  {
    name: "Tireur d'élite",
    attributes: ['critical_hit_damages'],
    valuePerLevel: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  },
  {
    name: 'Oeil de lynx',
    attributes: ['hit_damages'],
    valuePerLevel: [0.02, 0.04, 0.06, 0.08, 0.1, 0.12, 0.14, 0.16, 0.18],
  },
  {
    name: 'Enragé',
    attributes: ['critical_cac_damages'],
    valuePerLevel: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9],
  },
];

export async function fetchImplantsMock(): Promise<Implant[]> {
  await sleep(1000);
  const validated = await implantArrayResponseSchema.parseAsync(MOCK_IMPLANTS);

  const implants = validated.map(toDomain);
  return implants;
}
