import type { PropsWithChildren } from 'react';

import style from './Card.module.css';

interface Props {
  className?: string;
}

export const Card = ({
  className = '',
  children,
}: PropsWithChildren<Props>) => (
  <article className={`${style.card} ${className}`}>{children}</article>
);
