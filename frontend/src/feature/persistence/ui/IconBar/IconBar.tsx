import styles from './IconBar.module.css';

import kesslerLogo from '@/assets/kessler.png';
import kofiLogo from '@/assets/kofi.png';
import vertigoLogo from '@/assets/vertigo.png';
import { GithubIcon } from '@/ui/icons';
import { UiImage } from '@/ui/UiImage/UiImage';

export const IconBar = () => (
  <div className={styles.iconBar}>
    <a
      href="https://www.dreadcast.net/Forum/2-157189-k24---essler-industries?1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Kessler Industries"
      className={styles.iconLink}
    >
      <UiImage width={174} height={48} src={kesslerLogo} alt={'Logo Kessler'} />
    </a>
    <a
      href="https://www.dreadcast.net/Forum/2-155085--le-vertigo-?1"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Vertigo"
      className={styles.iconLink}
    >
      <UiImage width={87} height={48} src={vertigoLogo} alt={'Logo Vertigo'} />
    </a>
    <a
      href="https://github.com/Isilin/dreadcast_simulator"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open project on GitHub"
      className={styles.iconLink}
    >
      <GithubIcon width={48} height={48} />
    </a>
    <a
      href="https://ko-fi.com/isilin"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Support on Ko-fi"
      className={styles.iconLink}
    >
      <UiImage width={60} height={48} src={kofiLogo} alt={'Logo Ko-fi'} />
    </a>
  </div>
);

export default IconBar;
