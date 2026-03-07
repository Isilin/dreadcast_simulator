import type { HTMLAttributes, PropsWithChildren } from 'react';

import style from './Card.module.css';

export const Card = ({
  children,
  className,
  ...others
}: PropsWithChildren<HTMLAttributes<HTMLElement>>) => {
  return (
    <article className={`${style.card} ${className}`} {...others}>
      {children}
    </article>
  );
};
