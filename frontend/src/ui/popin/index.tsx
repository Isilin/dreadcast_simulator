import { Tooltip } from '@base-ui-components/react';
import { type HTMLProps, type PropsWithChildren, type ReactNode } from 'react';

import styles from './popin.module.css';

interface Props {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

export const Popin = ({
  content,
  children,
  placement,
}: PropsWithChildren<Props>) => {
  return (
    <Tooltip.Root delay={100}>
      <Tooltip.Trigger
        render={(props: HTMLProps<HTMLHeadingElement>) => (
          <span {...props}>{props.children}</span>
        )}
      >
        {children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={10} side={placement}>
          <Tooltip.Popup className={styles.content}>{content}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
