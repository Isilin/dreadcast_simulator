import { type PropsWithChildren, type ReactNode } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface Props {
  content: ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const Popin = ({
  content,
  children,
  placement,
  className,
}: PropsWithChildren<Props>) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn(className)}>{children}</span>
      </TooltipTrigger>
      <TooltipContent side={placement}>{content}</TooltipContent>
    </Tooltip>
  );
};
