import { usePseudoDialog } from '../../model';
import { useAccountProfile } from '../../services';

import { AuthMenuItem } from '@/feature/auth';

interface AccountMenuItemProps {
  onSelect: () => void;
}

/**
 * "Pseudo" entry of the account menu.
 */
export const AccountMenuItem = ({ onSelect }: AccountMenuItemProps) => {
  const { data: profile } = useAccountProfile();
  const { open } = usePseudoDialog();

  return (
    <AuthMenuItem
      onClick={() => {
        onSelect();
        open();
      }}
    >
      {profile?.pseudo ? `Pseudo : ${profile.pseudo}` : 'Choisir un pseudo'}
    </AuthMenuItem>
  );
};
