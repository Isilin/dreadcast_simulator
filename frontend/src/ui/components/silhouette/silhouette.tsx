import { useMemo, type CSSProperties } from 'react';

import styles from './silhouette.module.css';

import androidFemale from '@/assets/silhouette/androide_f.png';
import androidMale from '@/assets/silhouette/androide_m.png';
import elfFemale from '@/assets/silhouette/elfe_f.png';
import elfMale from '@/assets/silhouette/elfe_m.png';
import gnollFemale from '@/assets/silhouette/gnoll_f.png';
import gnollMale from '@/assets/silhouette/gnoll_m.png';
import gobelinFemale from '@/assets/silhouette/gobelin_f.png';
import gobelinMale from '@/assets/silhouette/gobelin_m.png';
import humanFemale from '@/assets/silhouette/humain_f.png';
import humanMale from '@/assets/silhouette/humain_m.png';
import koboldFemale from '@/assets/silhouette/kobold_f.png';
import koboldMale from '@/assets/silhouette/kobold_m.png';
import nainFemale from '@/assets/silhouette/nain_f.png';
import nainMale from '@/assets/silhouette/nain_m.png';
import orcFemale from '@/assets/silhouette/orc_f.png';
import orcMale from '@/assets/silhouette/orc_m.png';
import outrilienFemale from '@/assets/silhouette/outrilien_f.png';
import outrilienMale from '@/assets/silhouette/outrilien_m.png';
import trollFemale from '@/assets/silhouette/troll_f.png';
import trollMale from '@/assets/silhouette/troll_m.png';
import vautourFemale from '@/assets/silhouette/vautour_f.png';
import vautourMale from '@/assets/silhouette/vautour_m.png';
import { useSuit } from '@/ui/hooks/use-suit';

export const Silhouette = () => {
  const { gender, race } = useSuit();

  const thumb = useMemo(() => {
    switch (race?.type) {
      case 'Androide':
        return gender === 'male' ? androidMale : androidFemale;
      case 'Elfe':
        return gender === 'male' ? elfMale : elfFemale;
      case 'Gnoll':
        return gender === 'male' ? gnollMale : gnollFemale;
      case 'Gobelin':
        return gender === 'male' ? gobelinMale : gobelinFemale;
      case 'Humain':
        return gender === 'male' ? humanMale : humanFemale;
      case 'Kobold':
        return gender === 'male' ? koboldMale : koboldFemale;
      case 'Nain':
        return gender === 'male' ? nainMale : nainFemale;
      case 'Orc':
        return gender === 'male' ? orcMale : orcFemale;
      case 'Outrilien':
        return gender === 'male' ? outrilienMale : outrilienFemale;
      case 'Troll':
        return gender === 'male' ? trollMale : trollFemale;
      case 'Vautour':
        return gender === 'male' ? vautourMale : vautourFemale;
      default:
        return humanMale;
    }
  }, [race, gender]);

  const style = {
    ['--img' as keyof CSSProperties]: `url(${thumb})`,
  } as CSSProperties;

  return thumb ? (
    <div className={styles.silhouetteContainer} style={style}>
      <div className={styles.silhouetteFill} style={style} />
      <svg
        className={styles.silhouetteOutline}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <filter id="edgeGlow" colorInterpolationFilters="sRGB">
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius="1.01"
              result="outer"
            />
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="0.99"
              result="inner"
            />
            <feComposite in="outer" in2="inner" operator="out" result="ring" />
            <feGaussianBlur in="ring" stdDeviation="1.8" result="blur" />
            <feFlood floodColor="oklch(64.9% 0.1677 255.26)" result="col" />
            <feComposite in="col" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
            </feMerge>
          </filter>
          <clipPath id="box">
            <rect x="0" y="0" width="100" height="100" />
          </clipPath>
        </defs>
        <image
          href={thumb}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#box)"
          style={{ opacity: 0 }}
        />
        <image
          className={styles.pulse}
          href={thumb}
          x="0"
          y="0"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          filter="url(#edgeGlow)"
        />
      </svg>
    </div>
  ) : (
    <></>
  );
};
