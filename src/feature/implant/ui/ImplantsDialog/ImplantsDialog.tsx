import { MAX_IMPLANTS, useImplantsCount } from '../..';
import { ImplantsListSkeleton } from './ImplantsListSkeleton';
import { useImplants } from '../../services';
import { ImplantSelector } from '../ImplantSelector';

import { Modal } from '@/ui';
import { StatusCounterBadge } from '@/ui/StatusCounterBadge';

export const ImplantsDialog = () => {
  const { data: implants, status, error } = useImplants();
  const implantsCount = useImplantsCount();

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>
          Choisissez vos implants{' '}
          <StatusCounterBadge value={implantsCount} maxValue={MAX_IMPLANTS} />
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {status === 'error' && <p>{error.message}</p>}
        {status === 'pending' && <ImplantsListSkeleton />}
        {status === 'success' &&
          implants?.map((i) => <ImplantSelector implant={i} key={i.name} />)}
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close />
      </Modal.Footer>
    </Modal>
  );
};
