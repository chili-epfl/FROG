import * as React from 'react';
import { withRouter } from 'react-router';
import { Button } from '../Button';
import { useModal } from '/imports/ui/Modal';
import AccountModal from '/imports/client/AccountModal/AccountModal';

const LandingPage = ({ history }) => {
  const [showModal] = useModal();
  const openLoginModal = () => {
    showModal(<AccountModal formToDisplay="login" />);
  };
  return (
    <>
      <h1 align="center"> Welcome to FROG - this is a temp landing page </h1>
      <Button variant="primary" onClick={() => history.push('/single')}>
        CREATE YOUR FIRST ACTIVITY NOW!
      </Button>
      <Button variant="primary" onClick={openLoginModal}>
        Login
      </Button>
    </>
  );
};

export default withRouter(LandingPage);
