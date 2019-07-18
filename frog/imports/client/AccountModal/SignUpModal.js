// @flow
import * as React from 'react';
import { Modal } from '/imports/client/UIComponents/ModalController';
import SignUp from './SignUp';

export const SignUpModal = () => {
  return (
    <Modal
      title=""
      actions={hideModal => [{ title: 'Cancel', callback: hideModal }]}
    >
      {(showModal, hideModal) => <SignUp onSignUpSuccess={hideModal} />}
    </Modal>
  );
};
