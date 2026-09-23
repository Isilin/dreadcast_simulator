import { useDroppable, type Data } from '@dnd-kit/core';
import type { ReactNode } from 'react';

import styles from './DroppablePanel.module.css';

interface DroppablePanelProps {
  id: string;
  dropData: Data;
  title: string;
  className?: string;
  children: ReactNode;
}

export const DroppablePanel = ({
  id,
  dropData,
  title,
  className,
  children,
}: DroppablePanelProps) => {
  const { setNodeRef, isOver } = useDroppable({ id, data: dropData });

  return (
    <section
      ref={setNodeRef}
      className={className ? `${styles.panel} ${className}` : styles.panel}
      data-drop-over={isOver}
      aria-label={title}
    >
      {children}
    </section>
  );
};
