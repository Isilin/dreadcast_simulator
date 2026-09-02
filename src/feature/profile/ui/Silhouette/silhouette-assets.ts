import type { Gender, RaceType } from '../../model/profile.types';

import androidFemale from '@/assets/silhouette/androide_f.webp';
import androidMale from '@/assets/silhouette/androide_m.webp';
import elfFemale from '@/assets/silhouette/elfe_f.webp';
import elfMale from '@/assets/silhouette/elfe_m.webp';
import gnollFemale from '@/assets/silhouette/gnoll_f.webp';
import gnollMale from '@/assets/silhouette/gnoll_m.webp';
import gobelinFemale from '@/assets/silhouette/gobelin_f.webp';
import gobelinMale from '@/assets/silhouette/gobelin_m.webp';
import humanFemale from '@/assets/silhouette/humain_f.webp';
import humanMale from '@/assets/silhouette/humain_m.webp';
import koboldFemale from '@/assets/silhouette/kobold_f.webp';
import koboldMale from '@/assets/silhouette/kobold_m.webp';
import nainFemale from '@/assets/silhouette/nain_f.webp';
import nainMale from '@/assets/silhouette/nain_m.webp';
import orcFemale from '@/assets/silhouette/orc_f.webp';
import orcMale from '@/assets/silhouette/orc_m.webp';
import outrilienFemale from '@/assets/silhouette/outrilien_f.webp';
import outrilienMale from '@/assets/silhouette/outrilien_m.webp';
import trollFemale from '@/assets/silhouette/troll_f.webp';
import trollMale from '@/assets/silhouette/troll_m.webp';
import vautourFemale from '@/assets/silhouette/vautour_f.webp';
import vautourMale from '@/assets/silhouette/vautour_m.webp';

const silhouetteAssets: Record<RaceType, Record<Gender, string>> = {
  Androide: { male: androidMale, female: androidFemale },
  Elfe: { male: elfMale, female: elfFemale },
  Gnoll: { male: gnollMale, female: gnollFemale },
  Gobelin: { male: gobelinMale, female: gobelinFemale },
  Humain: { male: humanMale, female: humanFemale },
  Kobold: { male: koboldMale, female: koboldFemale },
  Nain: { male: nainMale, female: nainFemale },
  Orc: { male: orcMale, female: orcFemale },
  Outrilien: { male: outrilienMale, female: outrilienFemale },
  Troll: { male: trollMale, female: trollFemale },
  Vautour: { male: vautourMale, female: vautourFemale },
};

export const getSilhouetteAsset = (race: RaceType, gender: Gender): string =>
  silhouetteAssets[race]?.[gender] ?? silhouetteAssets.Humain.male;
