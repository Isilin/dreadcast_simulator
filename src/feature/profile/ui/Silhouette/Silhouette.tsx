import { useMemo, type CSSProperties } from 'react';

import { getSilhouetteAsset } from './silhouette-assets';
import styles from './Silhouette.module.css';
import { useProfileState } from '../../model/profile.store';

export const Silhouette = () => {
  const { gender, race } = useProfileState();

  const thumb = useMemo(() => getSilhouetteAsset(race, gender), [race, gender]);

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
