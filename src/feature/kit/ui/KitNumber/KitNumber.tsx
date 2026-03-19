import { NumberInput } from '@/components/ui/number-input';

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const KitNumber = ({ value, onChange }: Props) => {
  return <NumberInput value={value} onChange={onChange} min={0} />;
};
