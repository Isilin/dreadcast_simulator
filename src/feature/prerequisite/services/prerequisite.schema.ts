import z from 'zod';

import { ImplantNameValues } from '@/feature/implant';
import { RaceTypeValues } from '@/feature/profile';

/** `<owner>_prerequisite_title ( title_id )` */
export const titlePrerequisiteDtoSchema = z.object({
  title_id: z.string().min(1),
});

/** `<owner>_prerequisite_implant ( implant ( name ) )` */
export const implantPrerequisiteDtoSchema = z.object({
  implant: z.object({ name: z.enum(ImplantNameValues) }).nullable(),
});

/** `<owner>_prerequisite_race ( race )` */
export const racePrerequisiteDtoSchema = z.object({
  race: z.enum(RaceTypeValues),
});

export type TitlePrerequisiteDto = z.infer<typeof titlePrerequisiteDtoSchema>;
export type ImplantPrerequisiteDto = z.infer<
  typeof implantPrerequisiteDtoSchema
>;
export type RacePrerequisiteDto = z.infer<typeof racePrerequisiteDtoSchema>;
