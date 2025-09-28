import { ImplantSelector } from '../implant-selector';
import { ImplantsCounter } from '../implants-counter';

import { useImplants } from '@/data/implant';
import { Modal } from '@/ui/modal/modal';
import { Spinner } from '@/ui/spinner';

export const ImplantDialogSelector = () => {
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
        {status === 'pending' && <Spinner size={40} />}
        {status === 'success' &&
          implants?.map((i) => <ImplantSelector implant={i} key={i.name} />)}
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close>Close</Modal.Close>
      </Modal.Footer>
    </Modal>
  );
};
