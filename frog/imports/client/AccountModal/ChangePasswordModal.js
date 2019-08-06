import * as React from 'react';
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
import { Accounts } from 'meteor/accounts-base';
import ChangePasswordForm from './ChangePassword';

const ChangePasswordModal = () => {
  const [showToast, hideToast] = useToast();
  const [_1, hideModal] = useModal();

  const modalCallback = () => {
    // hides the toast which has the same key as the parameter
    hideToast();
    hideModal();
  };

  const onResetPassword = (oldPassword, newPassword) => {
    Accounts.changePassword(oldPassword, newPassword, err => {
      if (err) showToast(err.reason, 'error');
      else {
        showToast('Success! Password changed', 'success');
        hideModal();
      }
    });
  };

  return (
    <Modal title="" actions={[{ title: 'Cancel', callback: modalCallback }]}>
      <ChangePasswordForm onResetPassword={onResetPassword} />
    </Modal>
  );
};
export default ChangePasswordModal;
