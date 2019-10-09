// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withRouter } from 'react-router-dom';
import { SupervisedUserCircle, Edit } from '@material-ui/icons';
import Clear from '@material-ui/icons/Clear';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Breadcrumb } from '/imports/ui/Breadcrumb';

import { TopBar } from '/imports/ui/TopBar';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { Button } from '/imports/ui/Button';
import { useModal } from '/imports/ui/Modal';
import { RowButton, RowDivider, RowTitle } from '/imports/ui/RowItems';
import { getUsername, getUserType } from '/imports/api/users';
import { resetShareDBConnection } from '/imports/client/App/resetShareDBConnection';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { PersonalProfileModal } from '/imports/client/AccountModal/PersonalProfileModal';

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
                <RowButton onClick={openLoginModal} icon={<LockOutlinedIcon />}>
                  Login
                </RowButton>
              </React.Fragment>
            )}
            {userType === 'Verified' && (
              <React.Fragment>
                <RowButton onClick={openPersonalProfileModal} icon={<Edit />}>
                  Edit your profile
                </RowButton>
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
          icon={<Clear />}
          onClick={() => history.push('/')}
        />
        <Breadcrumb paths={[title]} />
      </>
    }
  />
));
