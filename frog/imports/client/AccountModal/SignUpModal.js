import * as React from 'react';
import { Modal } from '../Wiki/components/Modal';
import SignUp from './SignUp';

type SignUpModalPropsT = {
  hideModal: () => void
};

export default function SignUpModal({ hideModal }: SignUpModalPropsT) {
  return (
    <Modal title="" actions={[{ title: 'Cancel', callback: hideModal }]}>
      <SignUp hideModal={hideModal} />
    </Modal>
  );
}
