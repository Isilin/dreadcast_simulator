import z from 'zod';

export const raceResponseDtoSchema = z.object({
  type: z.enum([
    'Humain',
    'Elfe',
    'Nain',
    'Orc',
    'Troll',
    'Outrilien',
    'Vautour',
    'Gobelin',
    'Kobold',
    'Gnoll',
    'Androide',
  ]),
  strength: z.number().min(0),
  agility: z.number().min(0),
  robustness: z.number().min(0),
  perception: z.number().min(0),
  stealth: z.number().min(0),
  computing: z.number().min(0),
  medicine: z.number().min(0),
  engineering: z.number().min(0),
  health: z.number().min(0),
  stamina: z.number().min(0),
});

export const raceArrayResponseSchema = z.array(raceResponseDtoSchema);
