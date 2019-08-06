// @flow
import _ from 'lodash';
import * as React from 'react';
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
import { Meteor } from 'meteor/meteor';
import SignUp from './SignUp';
import Login from './Login';

const AccountModal = ({ formToDisplay }: { formToDisplay: string }) => {
  const [form, setForm] = React.useState(null);
  const [showToast, hideToast] = useToast();
  const [_1, hideModal] = useModal();
  let errorLoginToastKey = '';
  let errorSignUpToastKey = '';
  const openSignUpForm = () => {
    setForm('signup');
  };

  const openLoginForm = () => {
    setForm('login');
  };

  const onCreateAccount = (
    email: string,
    password: string,
    displayName: string
  ) => {
    Meteor.call(
      'create.account',
      email,
      password,
      {
        displayName
      },
      error => {
        if (error) {
          errorSignUpToastKey = showToast(error.reason, 'error');
        } else {
          showToast('Success! Account created!', 'success');
          hideModal();
        }
      }
    );
  };

  const onLogin = (email: string, password: string) => {
    Meteor.loginWithPassword(email, password, error => {
      if (error) {
        errorLoginToastKey = showToast('Could not login!  ' + error, 'error');
      } else {
        hideModal();
      }
    });
  };

  const modalCallback = () => {
    // hides the toast which has the same key as the parameter
    hideToast(errorLoginToastKey);
    hideToast(errorSignUpToastKey);
    hideModal();
  };

  const toRender = form || formToDisplay;

  return (
    <Modal title="" actions={[{ title: 'Cancel', callback: modalCallback }]}>
      {toRender === 'signup' ? (
        <SignUp
          openLoginForm={openLoginForm}
          onCreateAccount={onCreateAccount}
        />
      ) : (
        <Login onLogin={onLogin} openSignUpForm={openSignUpForm} />
      )}
    </Modal>
  );
};

export default AccountModal;
