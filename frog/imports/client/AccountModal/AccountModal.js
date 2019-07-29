// @flow
import _ from 'lodash';
import * as React from 'react';
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
>>>>>>> a554d328fb7f68212f050b290d3221679455d6e8
import { Meteor } from 'meteor/meteor';
import SignUp from './SignUp';
import Login from './Login';

const AccountModal = ({ formToDisplay }: { formToDisplay: string }) => {
  const [form, setForm] = React.useState(null);
  const [showToast] = useToast();
  const [_1, hideModal] = useModal();

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
          showToast(error.reason, 'error');
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
        showToast('Could not login!  ' + error, 'error');
      } else {
        hideModal();
      }
    });
  };

  const toRender = form || formToDisplay;

  return (
    <Modal title="" actions={hmodal => [{ title: 'Cancel', callback: hmodal }]}>
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

