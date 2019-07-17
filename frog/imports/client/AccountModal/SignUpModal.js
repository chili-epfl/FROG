
// @flow
import * as React from 'react';
import { Modal } from '/imports/frog-utils';
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
>>>>>>> bc52cd955ca49c1ff6fb4b64a707c3609fb5b60d
