import type { Ref } from 'react';

import styles from './AppFooter.module.css';
import { GithubIcon } from '../Icon';
import { UiImage } from '../UiImage';

import kesslerLogo from '@/assets/kessler.webp';
import kofiLogo from '@/assets/kofi.webp';
import nomuraLogo from '@/assets/nomura.webp';
import vertigoLogo from '@/assets/vertigo.webp';

const LOGO_HEIGHT = 32;

const PARTNERS = [
  {
    label: 'Kessler Industries',
    href: 'https://www.dreadcast.net/Forum/2-157189-k24---essler-industries?1',
    logo: kesslerLogo,
    width: 116,
  },
  {
    label: 'Vertigo',
    href: 'https://www.dreadcast.net/Forum/2-155085--le-vertigo-?1',
    logo: vertigoLogo,
    width: 58,
  },
  {
    label: 'Nomura Incorporated',
    href: 'https://www.dreadcast.net/Forum/2-157189-k24---essler-industries?1',
    logo: nomuraLogo,
    width: 47,
  },
];

interface AppFooterProps {
  /** Receives the centre area, filled by pages through AppFooterPortal. */
  slotRef?: Ref<HTMLDivElement>;
}

export const AppFooter = ({ slotRef }: AppFooterProps) => (
  <footer className={styles.footer}>
    <nav className={styles.group} aria-label="Partenaires">
      {PARTNERS.map(({ label, href, logo, width }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={styles.link}
        >
          <UiImage
            src={logo}
            alt=""
            decorative
            width={width}
            height={LOGO_HEIGHT}
            fit="contain"
          />
        </a>
      ))}
    </nav>
    <div ref={slotRef} className={styles.slot} />
    <nav className={`${styles.group} ${styles.end}`} aria-label="Projet">
      <a
        href="https://github.com/Isilin/dreadcast_simulator"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Code source sur GitHub"
        className={styles.link}
      >
        <GithubIcon width={28} height={28} />
      </a>
      <a
        href="https://ko-fi.com/isilin"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Soutenir sur Ko-fi"
        className={styles.link}
      >
        <UiImage
          src={kofiLogo}
          alt=""
          decorative
          width={40}
          height={LOGO_HEIGHT}
          fit="contain"
        />
      </a>
    </nav>
  </footer>
);
