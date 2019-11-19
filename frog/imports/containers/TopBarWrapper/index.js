// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';

import { SupervisedUserCircle, Edit, ArrowBack } from '@material-ui/icons';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Breadcrumb } from '/imports/ui/Breadcrumb';

import { TopBar } from '/imports/ui/TopBar';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { Button } from '/imports/ui/Button';
import { useModal } from '/imports/ui/Modal';
import { RowButton, RowDivider, RowTitle } from '/imports/ui/RowItems';
import { getUsername, getUserType, checkUserAdmin } from '/imports/api/users';
import { resetShareDBConnection } from '/imports/client/App/resetShareDBConnection';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { PersonalProfileModal } from '/imports/client/AccountModal/PersonalProfileModal';
import UsersListModal from '/imports/ui/UsersListModal';

type TopBarWrapperPropsT = {
  navigation: React.Element<*>,
  actions: React.Element<*>,
  history: Object
};

const TopBarWrapper = ({
  navigation,
  actions,
  history
}: TopBarWrapperPropsT) => {
  const [showModal] = useModal();

  const [adminModal, setAdminModal] = React.useState(false);

  const openAdminModal = () => {
    setAdminModal(true);
  };

  const closeAdminModal = () => {
    setAdminModal(false);
  };

  const adminImpersonate = (id: string, type: string) => {
    if (type !== 'Anonymous') {
      Meteor.call('impersonation.token', id, (err, res) => {
        if (err) {
          console.info(err);
        } else {
          history.push(`?u=${id}&token=${res}`);
          window.location.reload();
        }
      });
    } else {
      history.push(`?u=${id}`);
      window.location.reload();
    }
  };

  const openSignUpModal = () => {
    showModal(<AccountModal formToDisplay="signup" />);
  };

  const openLoginModal = () => {
    showModal(<AccountModal formToDisplay="login" />);
  };

  const doLogout = () => {
    sessionStorage.removeItem('frog.sessionToken');
    Meteor.logout(() => {
      resetShareDBConnection();
      history.push('/');
      window.location.reload();
    });
  };

  const openPersonalProfileModal = () => {
    showModal(<PersonalProfileModal />);
  };
  const userType = getUserType();

  return (
    <>
      <TopBar
        navigation={navigation}
        actions={
          <>
            <>{actions}</>

            <OverflowMenu
              button={
                <Button variant="minimal" icon={<SupervisedUserCircle />} />
              }
            >
              <RowTitle>Logged in as {getUsername()} </RowTitle>
              <RowDivider />
              {userType === 'Anonymous' && (
                <React.Fragment>
                  <RowButton
                    onClick={openSignUpModal}
                    icon={<LockOutlinedIcon />}
                  >
                    Create an account
                  </RowButton>
                  <RowButton
                    onClick={openLoginModal}
                    icon={<LockOutlinedIcon />}
                  >
                    Login
                  </RowButton>
                </React.Fragment>
              )}
              {userType === 'Verified' && (
                <React.Fragment>
                  <RowButton onClick={openPersonalProfileModal} icon={<Edit />}>
                    Edit your profile
                  </RowButton>
                  {checkUserAdmin() && (
                    <RowButton
                      onClick={openAdminModal}
                      icon={<AccountBoxIcon />}
                    >
                      Impersonate User
                    </RowButton>
                  )}
                  <RowButton onClick={doLogout} icon={<LockOutlinedIcon />}>
                    Logout
                  </RowButton>
                </React.Fragment>
              )}
              {userType === 'Legacy' && (
                <React.Fragment>
                  <RowButton
                    onClick={openSignUpModal}
                    icon={<LockOutlinedIcon />}
                  >
                    Upgrade your account
                  </RowButton>

                  <RowButton onClick={doLogout} icon={<LockOutlinedIcon />}>
                    Logout
                  </RowButton>
                </React.Fragment>
              )}
            </OverflowMenu>
          </>
        }
      />
      {checkUserAdmin() && adminModal && (
        <UsersListModal
          open={adminModal}
          closeModal={closeAdminModal}
          impersonate={adminImpersonate}
        />
      )}
    </>
  );
};

export const TopBarAccountsWrapper = withRouter(TopBarWrapper);

export const SimpleTopBar = withRouter(({ title, history }) => (
  <TopBarAccountsWrapper
    actions={<></>}
    navigation={
      <>
        <Button
          variant="minimal"
          icon={<ArrowBack />}
          onClick={() => history.push('/')}
        />
        <Breadcrumb paths={[title]} />
      </>
    }
  />
));
