import { useState, type ReactNode } from 'react';

import { Fallback } from '../Fallback/Fallback';
import { Spinner } from '../spinner';
import { imageCache, prefetchImage } from './cache';
import styles from './UiImage.module.css';

interface Props {
  src: string;
  alt: string;
  /** Optional additional <source/> entries for <picture> (webp/avif/etc) */
  sources?: Array<{
    src: string;
    type?: string;
    srcSet?: string;
    sizes?: string;
  }>;
  className?: string;
  wrapperClassName?: string;
  width?: number;
  height?: number;
  size?: number;
  title?: string;
  spinner?: ReactNode;
  fallback?: ReactNode;
  fit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  radius?: number;
  decorative?: boolean;
  srcSet?: string;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
  /** low-quality placeholder shown while the full image loads (LQIP) */
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const UiImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  width,
  height,
  size,
  title,
  spinner,
  fallback,
  fit,
  radius,
  decorative,
  sources,
  srcSet,
  sizes,
  fetchPriority,
  onLoad,
  onError,
  placeholder,
}: Props) => {
  const w = size ?? width ?? 48;
  const h = size ?? height ?? 48;

  const [loaded, setLoaded] = useState(() => imageCache.has(src));
  const [errored, setErrored] = useState(false);

  const handleLoad = () => {
    imageCache.add(src);
    setLoaded(true);
    onLoad?.();
  };
  const handleError = () => {
    setErrored(true);
    onError?.();
  };

  const handleMouseEnter = () => {
    // prefetch the main src and any additional sources
    prefetchImage(src);
    if (sources?.length) {
      sources.forEach((s) => prefetchImage(s.src));
    }
  };

  return (
    <span
      className={[styles.wrapper, wrapperClassName].filter(Boolean).join(' ')}
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        backgroundImage:
          !loaded && !errored && placeholder
            ? `url(${placeholder})`
            : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      aria-busy={!loaded && !errored}
      onMouseEnter={handleMouseEnter}
    >
      {!loaded && !errored && (
        <span className={styles.center}>
          {spinner ?? <Spinner size={24} />}
        </span>
      )}

      {!errored ? (
        // If additional sources were provided, render a <picture> so callers can provide webp/avif
        sources && sources.length ? (
          <picture>
            {sources.map((s) => (
              <source
                key={s.src}
                srcSet={s.srcSet ?? s.src}
                type={s.type}
                sizes={s.sizes}
              />
            ))}
            <img
              src={src}
              srcSet={srcSet}
              sizes={sizes}
              alt={decorative ? '' : alt}
              role={decorative ? 'presentation' : undefined}
              title={title}
              width={w}
              height={h}
              loading="lazy"
              decoding="async"
              fetchPriority={fetchPriority}
              onLoad={handleLoad}
              onError={handleError}
              className={[
                styles.img,
                loaded ? styles.visible : styles.hidden,
                className,
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ objectFit: fit, borderRadius: radius }}
            />
          </picture>
        ) : (
          <img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={decorative ? '' : alt}
            role={decorative ? 'presentation' : undefined}
            title={title}
            width={w}
            height={h}
            loading="lazy"
            decoding="async"
            fetchPriority={fetchPriority}
            onLoad={handleLoad}
            onError={handleError}
            onMouseEnter={() => prefetchImage(src)}
            className={[
              styles.img,
              loaded ? styles.visible : styles.hidden,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ objectFit: fit, borderRadius: radius }}
          />
        )
      ) : (
        <span
          className={[styles.center, styles.fallback].join(' ')}
          role="img"
          aria-label={alt}
          title={title}
        >
          {fallback ?? <Fallback />}
        </span>
      )}
    </span>
  );
};
