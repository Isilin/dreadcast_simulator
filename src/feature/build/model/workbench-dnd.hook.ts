import {
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useState } from 'react';

import {
  getDragLabel,
  getDraggedData,
  getDropAnnouncement,
  getDropData,
} from './drag-drop.helpers';
import type { WorkbenchDragData } from './drag-drop.types';
import {
  handleDrop,
  type DropHandlerActions,
} from './drop.handler';

import type { ItemSpot } from '@/domain';
import type { Item } from '@/feature/item';
import type { KitSelection } from '@/feature/kit';

interface UseWorkbenchDndParams extends DropHandlerActions {
  activeItem: Item | null;
  kits: KitSelection[];
  onSpotChange: (spot: ItemSpot) => void;
}

export const useWorkbenchDnd = ({
  activeItem,
  kits,
  onSpotChange,
  ...actions
}: UseWorkbenchDndParams) => {
  const [draggedData, setDraggedData] = useState<WorkbenchDragData | null>(
    null,
  );
  const [dragAnnouncement, setDragAnnouncement] = useState('');
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    const nextDraggedData = getDraggedData(active.data.current);
    setDraggedData(nextDraggedData);
    setDragAnnouncement(
      nextDraggedData
        ? `${getDragLabel(nextDraggedData)} sélectionné.`
        : 'Élément sélectionné.',
    );
  };

  const onDragOver = ({ over }: DragOverEvent) => {
    const dropData = getDropData(over?.data.current);
    if (!draggedData || !dropData) {
      setDragAnnouncement('Aucun emplacement compatible ciblé.');
      return;
    }

    setDragAnnouncement(getDropAnnouncement(draggedData, dropData));
  };

  const onDragCancel = () => {
    setDraggedData(null);
    setDragAnnouncement('Déplacement annulé.');
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const result = handleDrop({
      dragData: getDraggedData(active.data.current),
      dropData: getDropData(over?.data.current),
      activeItem,
      kits,
      ...actions,
    });

    if (result.nextSpot) {
      onSpotChange(result.nextSpot);
    }
    setDragAnnouncement(result.message);
    setDraggedData(null);
  };

  const accessibility = {
    announcements: {
      onDragStart: ({ active }: DragStartEvent) => {
        const dragData = getDraggedData(active.data.current);
        return dragData
          ? `${getDragLabel(dragData)} sélectionné.`
          : 'Élément sélectionné.';
      },
      onDragOver: ({ active, over }: DragOverEvent) => {
        const dragData = getDraggedData(active.data.current);
        const dropData = getDropData(over?.data.current);
        if (!dragData || !dropData) {
          return 'Aucun emplacement compatible ciblé.';
        }
        return getDropAnnouncement(dragData, dropData);
      },
      onDragEnd: ({ active, over }: DragEndEvent) => {
        const dragData = getDraggedData(active.data.current);
        const dropData = getDropData(over?.data.current);
        if (!dragData || !dropData) {
          return 'Élément non déplacé.';
        }
        return `${getDragLabel(dragData)} déplacé.`;
      },
      onDragCancel: () => 'Déplacement annulé.',
    },
    screenReaderInstructions: {
      draggable:
        'Pour déplacer un élément, appuyez sur la barre espace. Utilisez les flèches pour choisir une zone. Appuyez de nouveau sur espace pour déposer, ou sur Échap pour annuler.',
    },
  };

  return {
    accessibility,
    draggedData,
    dragAnnouncement,
    onDragCancel,
    onDragEnd,
    onDragOver,
    onDragStart,
    sensors,
  };
};
