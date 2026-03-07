import type { PropsWithChildren } from 'react';

import styles from './Footer.module.css';

export const Footer = ({ children }: PropsWithChildren) => {
  return <footer className={styles.container}>{children}</footer>;
};
