import type { PropsWithChildren } from 'react';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const Modal = ({ children }: PropsWithChildren) => {
  return <DialogContent showCloseButton={false}>{children}</DialogContent>;
};

Modal.Close = () => (
  <DialogClose asChild>
    <Button variant="outline">Fermer</Button>
  </DialogClose>
);
Modal.Description = DialogDescription;
Modal.Title = ({ children }: PropsWithChildren) => (
  <DialogTitle>{children}</DialogTitle>
);
Modal.Header = ({ children }: PropsWithChildren) => (
  <DialogHeader>{children}</DialogHeader>
);
Modal.Footer = ({ children }: PropsWithChildren) => (
  <DialogFooter>{children}</DialogFooter>
);
Modal.Content = ({ children }: PropsWithChildren) => (
  <div className="overflow-y-auto max-h-[60vh]">{children}</div>
);
