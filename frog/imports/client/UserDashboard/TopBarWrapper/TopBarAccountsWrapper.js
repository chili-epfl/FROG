// @flow
import * as React from 'react';
import { type TopBarWrapperPropsT } from './types';
import { Meteor } from 'meteor/meteor';
import { TopBar } from '/imports/ui/TopBar';
import { getUsername, getUserType } from '/imports/api/users';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import { useModal } from '/imports/ui/Modal';
import { SupervisedUserCircle, Edit } from '@material-ui/icons';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { resetShareDBConnection } from '/imports/client/App/resetShareDBConnection';
import { RowButton, RowDivider, RowTitle } from '/imports/ui/RowItems';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { Button } from '/imports/ui/Button';
import { PersonalProfileModal } from '/imports/client/AccountModal/PersonalProfileModal';

export const TopBarAccountsWrapper = ({ title }: TopBarWrapperPropsT) => {
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
      window.location.reload();
    });
  };

  const openPersonalProfileModal = () => {
    showModal(<PersonalProfileModal />);
  };
  const userType = getUserType();

  return (
    <TopBar
      navigation={<Breadcrumb paths={[title]} />}
      actions={
        <OverflowMenu
          button={<Button variant="minimal" icon={<SupervisedUserCircle />} />}
        >
          <RowTitle>Logged in as {getUsername()} </RowTitle>
          <RowDivider />
          {userType === 'Anonymous' && (
            <React.Fragment>
              <RowButton onClick={openSignUpModal} icon={<LockOutlinedIcon />}>
                Create an account{' '}
              </RowButton>
              <RowButton onClick={openLoginModal} icon={<LockOutlinedIcon />}>
                {' '}
                Login
              </RowButton>
            </React.Fragment>
          )}
          {userType === 'Verified' && (
            <React.Fragment>
              <RowButton onClick={openPersonalProfileModal} icon={<Edit />}>
                {' '}
                Edit your profile{' '}
              </RowButton>
              <RowButton onClick={doLogout} icon={<LockOutlinedIcon />}>
                {' '}
                Logout
              </RowButton>
            </React.Fragment>
          )}
          {userType === 'Legacy' && (
            <React.Fragment>
              <RowButton onClick={openSignUpModal} icon={<LockOutlinedIcon />}>
                Upgrade your account{' '}
              </RowButton>

              <RowButton onClick={doLogout} icon={<LockOutlinedIcon />}>
                {' '}
                Logout
              </RowButton>
            </React.Fragment>
          )}
        </OverflowMenu>
      }
    />
  );
};
