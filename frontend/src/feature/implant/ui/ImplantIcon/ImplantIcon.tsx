import { useState } from 'react';

import styles from './ImplantIcon.module.css';
import { THUMBS } from './thumbs';

import { type ImplantName, useImplantStatus } from '@/feature/implant';
import { Spinner } from '@/ui/spinner';

interface Props {
  implant: ImplantName;
}

const loadedCache = new Set<string>();

export const ImplantIcon = ({ implant }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const status = useImplantStatus(implant);
  const src = THUMBS[implant];

  const handleLoad = () => {
    loadedCache.add(src);
    setLoaded(true);
  };

  if (!src) {
    return (
      <span
        className={`${styles.wrapper}`}
        style={{ width: 100, height: 100 }}
      />
    );
  }

  return (
    <span
      className={`${styles.wrapper}`}
      style={{ width: 100, height: 100 }}
      aria-busy={!loaded}
    >
      {!loaded && !error && <Spinner />}
      <img
        src={src}
        alt={implant}
        title="Miniature d'implant"
        width={100}
        height={100}
        loading="lazy"
        decoding="async"
        fetchPriority="low"
        onLoad={handleLoad}
        onError={() => setError(true)}
        className={[
          styles.img,
          loaded ? styles.visible : styles.hidden,
          status ? styles[status] : '',
          error ? styles.error : '',
        ].join(' ')}
      />
      {error && (
        <div className={styles.fallback} role="img" aria-label={implant} />
      )}
    </span>
  );
};
