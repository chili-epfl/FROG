// @flow
import * as React from 'react';
import { Modal } from '/imports/frog-utils';
import SignUp from './SignUp';
import Login from './Login';

type AccountModalStateT = {
  formToDisplay: string
};
type AccountModalPropsT = {
  formToDisplay: string
};

export default class AccountModal extends React.Component<
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

  chooseModal = (showModal, hideModal) => {
    if (
      this.state.formToDisplay === 'signup' ||
      this.props.formToShow === 'signup'
    )
      return (
        <SignUp
          onSignUpSuccess={hideModal}
          openLoginForm={this.openLoginForm}
        />
      );
    else if (
      this.state.formToDisplay === 'login' ||
      this.props.formToShow === 'login'
    )
      return (
        <Login
          onLoginSuccess={hideModal}
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
