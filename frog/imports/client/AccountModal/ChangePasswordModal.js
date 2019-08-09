import * as React from 'react';
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
import { Accounts } from 'meteor/accounts-base';
import ChangePasswordForm from './ChangePasswordForm';

const ChangePasswordModal = () => {
  const [showToast, hideToast] = useToast();
  const [hideModal] = useModal();

  const modalCallback = () => {
    // hides the toast which has the same key as the parameter
    hideToast();
    hideModal();
  };

  const onChangePassword = (oldPassword, newPassword) => {
    Accounts.changePassword(oldPassword, newPassword, err => {
      if (err) {
        if (err.error === 403) {
          showToast(
            'The old password that you entered is incorrect, please try again',
            'error'
          );
        } else showToast(err.reason, 'error');
      } else {
        showToast('Success! Password changed', 'success');
        hideModal();
      }
    });
  };

  return (
    <Modal title="" actions={[{ title: 'Cancel', callback: modalCallback }]}>
      <ChangePasswordForm onChangePassword={onChangePassword} />
    </Modal>
  );
};
export default ChangePasswordModal;
