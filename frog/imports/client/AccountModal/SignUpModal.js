import * as React from 'react';
import { Modal, type HideModalFunctionT } from '../Wiki/components/Modal';
import SignUp from './SignUp';

type SignUpModalPropsT = {
  hideModal: HideModalFunctionT
};

export default function SignUpModal({ hideModal }: SignUpModalPropsT) {
  return (
    <Modal title="" actions={[{ title: 'Cancel', callback: hideModal }]}>
      <SignUp />
    </Modal>
  );
}
