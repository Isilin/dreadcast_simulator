import { MinusIcon, PlusIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from './button';
import { Input } from './input';

import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
  id?: string;
}

function NumberInput({
  value,
  onChange,
  min,
  max,
  className,
  id,
}: NumberInputProps) {
  const canDecrement = min === undefined || value > min;
  const canIncrement = max === undefined || value < max;

  const handleDecrement = () => {
    const next = value - 1;
    if (min === undefined || next >= min) onChange(next);
  };

  const handleIncrement = () => {
    const next = value + 1;
    if (max === undefined || next <= max) onChange(next);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (isNaN(parsed)) return;
    const clamped =
      min !== undefined && max !== undefined
        ? Math.min(max, Math.max(min, parsed))
        : min !== undefined
          ? Math.max(min, parsed)
          : max !== undefined
            ? Math.min(max, parsed)
            : parsed;
    onChange(clamped);
  };

  return (
    <div className={cn('flex items-center', className)}>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-r-none border-r-0"
        onClick={handleDecrement}
        disabled={!canDecrement}
        aria-label="Décrémenter"
      >
        <MinusIcon className="size-3" />
      </Button>
      <Input
        id={id}
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="h-9 w-16 rounded-none border-x-0 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="h-9 w-9 rounded-l-none border-l-0"
        onClick={handleIncrement}
        disabled={!canIncrement}
        aria-label="Incrémenter"
      >
        <PlusIcon className="size-3" />
      </Button>
    </div>
  );
}

export { NumberInput };
