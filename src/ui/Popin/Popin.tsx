import { Tooltip } from '@base-ui/react/tooltip';
import { type HTMLProps, type PropsWithChildren, type ReactNode } from 'react';

import styles from './Popin.module.css';

interface Props {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Class of the trigger. */
  className?: string;
  /** Extra class of the popup, e.g. to give it a status color. */
  popupClassName?: string;
}

export const Popin = ({
  content,
  children,
  placement,
  className,
  popupClassName,
}: PropsWithChildren<Props>) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger
        render={(props: HTMLProps<HTMLHeadingElement>) => (
          <span {...{ ...props, className }}>{props.children}</span>
        )}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={10} side={placement}>
          <Tooltip.Popup
            className={
              popupClassName
                ? `${styles.content} ${popupClassName}`
                : styles.content
            }
          >
            {content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
