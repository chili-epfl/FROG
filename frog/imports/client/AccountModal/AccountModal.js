// @flow
import _ from 'lodash'; 
import * as React from 'react';
import { Modal, withModal } from '/imports/ui/Modal';
import { Meteor } from 'meteor/meteor';
import SignUp from './SignUp';
import Login from './Login';

type AccountModalStateT = {
  formToDisplay: string
};
type AccountModalPropsT = {
  formToDisplay: string
};

class AccountModal extends React.Component<
  AccountModalStateT,
  AccountModalPropsT
> {
  constructor(props) {
    super(props);
    this.state = {
      formToDisplay: null
    };
  }

  openSignUpForm = () => {
    this.setState({ formToDisplay: 'signup' });
  };

  openLoginForm = () => {
    this.setState({ formToDisplay: 'login' });
  };

  onCreateAccount = (email: string, password: string, displayName: string) => {
    Meteor.call(
      'create.account',
      email,
      password,
      {
        displayName
      },
      error => {
        if (error) {
          this.props.showToast(error.reason,'error',[]);
        } else {
          this.props.showToast('Success! Account created!', 'success',[]);
          this.props.hideModal();
        }
      }
    );
  };

  onLogin = (email: string, password: string) => {
    Meteor.loginWithPassword(email, password, error => {
      if (error) {
        this.props.showToast('Could not login!  ' + error,'error',[] );
      } else {
        this.props.hideModal();
      }
    });
  };

  render() {
    const toRender = this.state?.formToDisplay || this.props.formToDisplay;

    return (
      <Modal
        title=""
        actions={hideModal => [{ title: 'Cancel', callback: hideModal }]}
      >
        {toRender === 'signup' ? (
          <SignUp
            openLoginForm={this.openLoginForm}
            onCreateAccount={this.onCreateAccount}
          />
        ) : (
          <Login onLogin={this.onLogin} openSignUpForm={this.openSignUpForm} />
        )}
      </Modal>
    );
  }
}

export default _.flow([withModal, withToast])(AccountModal);
