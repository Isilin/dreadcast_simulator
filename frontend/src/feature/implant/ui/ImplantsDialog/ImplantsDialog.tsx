import { useImplants } from '../../services';
import { ImplantsCounter } from '../ImplantsCounter';
import { ImplantSelector } from '../ImplantSelector';
import { ImplantsListSkeleton } from './ImplantsListSkeleton';

import { Modal } from '@/ui/Modal/Modal';

export const ImplantsDialog = () => {
  const { data: implants, status, error } = useImplants();

  return (
    <Modal>
      <Modal.Header>
        <Modal.Title>
          Choisissez vos implants <ImplantsCounter />
        </Modal.Title>
      </Modal.Header>
      <Modal.Content>
        {status === 'error' && <p>{error.message}</p>}
        {status === 'pending' && <ImplantsListSkeleton />}
        {status === 'success' && implants?.map((i) => <ImplantSelector implant={i} key={i.name} />)}
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close>Close</Modal.Close>
      </Modal.Footer>
    </Modal>
  );
};
