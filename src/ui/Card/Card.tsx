import type { PropsWithChildren } from 'react';

import style from './Card.module.css';

interface Props {
  onClick?: () => void;
  id?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  state?: 'disable' | 'error' | 'warning' | 'default' | 'info';
  variant?: 'slot' | 'list';
}

export const Card = ({
  onClick,
  id,
  label,
  className = '',
  style: inlineStyle,
  state = 'default',
  variant = 'slot',
  children,
}: PropsWithChildren<Props>) => {
  return (
    <article
      id={id}
      aria-label={label}
      className={`${style.card} ${className}`}
      style={inlineStyle}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      data-variant={variant}
      data-state={state}
    >
      {children}
    </article>
  );
};
