// @flow
import * as React from 'react';
import { type TopBarWrapperPropsT } from './types';
import { Meteor } from 'meteor/meteor';
import { TopBar } from '/imports/ui/TopBar';
import { getUsername } from '/imports/api/users';
import AccountModal from '/imports/client/AccountModal';
import { useModal } from '/imports/ui/Modal';
import { SupervisedUserCircle } from '@material-ui/icons';
import { resetShareDBConnection } from '/imports/client/App/resetShareDBConnection';
import { RowButton, RowDivider, RowTitle } from '/imports/ui/RowItems';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { Button } from '/imports/ui/Button';

// removed the code below to experiment with just one button and one callback to the modal
// const AccountButtons = () => {

//     switch (getUserType()) {
//         case 'Anonymous': return(
//             <>
//             <RowButton onClick = {openSignUpModal} icon={<LockOutlinedIcon />}>Create an account </RowButton>
//             <RowDivider/>
//             <RowButton onClick = {doLogout} icon={<LockOutlinedIcon  />}> Logout</RowButton>
//             </>

//         )
//     case 'Legacy':

//         return (
//             <>
//             <RowButton onClick = {openSignUpModal} icon={<LockOutlinedIcon  />}>Upgrade your account </RowButton>
//             <RowDivider/>
//             <RowButton onClick = {doLogout} icon={<LockOutlinedIcon  />}> Logout</RowButton>
//             </>
//         )

//     case 'Verified':
//     return (
//             <>
//             <RowButton onClick = {openPersonalProfileModal} icon={<Edit  />}>View/Edit Profile</RowButton>
//             <RowDivider/>
//             <RowButton onClick = {doLogout} icon={<LockOutlinedIcon  />}> Logout</RowButton>
//             </>
//     );

//     default:
//     return (
//     <>
//     <RowButton onClick = {openLoginModal} icon = {<LockOutlinedIcon/>}>Login</RowButton>
//     <RowButton onClick = {openSignUpModal} icon = {<LockOutlinedIcon/>}>Login</RowButton>
//     </> )
//     }

// }
const TopBarAccountsWrapper = ({ title }: TopBarWrapperPropsT) => {
  const [showModal] = useModal();

  const openSignUpModal = () => {
    showModal(<AccountModal formToDisplay="signup" />);
  };

  const doLogout = () => {
    sessionStorage.removeItem('frog.sessionToken');
    Meteor.logout(() => {
      resetShareDBConnection();
      window.location.reload();
    });
  };
  return (
    <TopBar
      navigation={<Breadcrumb paths={[title]} />}
      actions={
        <>
          <OverflowMenu
            button={
              <Button variant="minimal" icon={<SupervisedUserCircle />} />
            }
          >
            
              <RowTitle>Logged in as {getUsername()} </RowTitle>
              <RowDivider />
              <RowButton onClick={openSignUpModal}> Sign Up </RowButton>
              <RowButton onClick={doLogout}> Logout </RowButton>
            
          </OverflowMenu>
        </>
      }
    />
  );
};

export default TopBarAccountsWrapper;
