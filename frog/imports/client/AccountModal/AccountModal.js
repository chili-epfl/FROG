// @flow
import * as React from 'react';
import { Modal, withModal } from '/imports/client/ui/Modal';
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
        if (error && error.error === 'mongo-error') {
          window.alert(error.reason);
        } else {
          window.alert('Success! Account created!');
          this.props.hideModal();
        }
      }
    );
  };

  onLogin = (email: string, password: string) => {
    Meteor.loginWithPassword(email, password, error => {
      if (error) {
        window.alert('Could not login!  ' + error);
      } else {
        this.props.hideModal();
      }
    });
  };

  chooseModal = () => {
    if (
      this.state.formToDisplay === 'signup' ||
      this.props.formToDisplay === 'signup'
    )
      return (
        <SignUp
          openLoginForm={this.openLoginForm}
          onCreateAccount={(email, password, displayName) =>
            this.onCreateAccount(email, password, displayName)
          }
        />
      );
    else if (
      this.state.formToDisplay === 'login' ||
      this.props.formToDisplay === 'login'
    )
      return (
        <Login
          onLogin={(email, password) => this.onLogin(email, password)}
          openSignUpForm={this.openSignUpForm}
        />
      );
  };

  render() {
    return (
      <Modal
        title=""
        actions={hideModal => [{ title: 'Cancel', callback: hideModal }]}
      >
        {this.chooseModal}
      </Modal>
    );
  }
}

export default withModal(AccountModal);
