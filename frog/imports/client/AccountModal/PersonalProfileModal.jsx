import * as React from 'react';
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';
import ChangePasswordForm from './ChangePasswordForm';
import { PersonalProfileForm } from './PersonalProfileForm';

export const PersonalProfileModal = () => {
  const [form, setForm] = React.useState('default');
  const [_1, hideModal] = useModal();
  const [showToast, hideToast] = useToast();
  const openDisplayNameForm = () => {
    setForm('DisplayName');
  };
  const openPasswordForm = () => {
    setForm('Password');
  };
  const onChangeDisplayName = newDisplayName => {
    Meteor.call('change.displayname', newDisplayName, err => {
      if (err) showToast(err.reason, 'error');
      else {
        setForm('default');
      }
    });
  };
  const onChangePassword = (oldPassword, newPassword) => {
    Accounts.changePassword(oldPassword, newPassword, err => {
      if (err) {
        if (err.error === 403) {
          showToast(
            'Your old password is incorrect. Please try again',
            'error'
          );
        } else showToast(err.reason, 'error');
      } else {
        showToast('Success! Password changed', 'success');
        setForm('default');
      }
    });
  };

  const modalCallback = () => {
    // hides the toast which has the same key as the parameter
    hideToast();
    hideToast();
    if (form !== 'default') setForm('default');
    else hideModal();
  };
  const ComponentToRender = () => {
    switch (form) {
      case 'DisplayName':
        return (
          <ChangeDisplayNameForm onChangeDisplayName={onChangeDisplayName} />
        );
      case 'Password':
        return <ChangePasswordForm onChangePassword={onChangePassword} />;
      default:
        return (
          <PersonalProfileForm
            openPasswordForm={openPasswordForm}
            openDisplayNameForm={openDisplayNameForm}
          />
        );
    }
  };

  return (
    <Modal title="" actions={[{ title: 'Back', callback: modalCallback }]}>
      <ComponentToRender />
    </Modal>
  );
};
