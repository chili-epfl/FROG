// @flow 
import * as React from 'react'; 
import {type TopBarWrapperPropsT, type MenuItemT } from './types'; 
import {Meteor} from 'meteor/meteor'; 
import { TopBar } from '/imports/ui/TopBar';
import { getUserType, getUsername } from '/imports/api/users';
import { PersonalProfileModal } from '/imports/client/AccountModal/PersonalProfileModallProfileModal';
import { useModal } from '/imports/ui/Modal';
import {Edit, LockOutlinedIcon, MoreHorizRounded} from '@material-ui/icons'; 
import { resetShareDBConnection } from '/imports/client/App/resetShareDBConnection';
import { RowButton, RowDivider } from '/imports/ui/RowItems';
import { OverflowMenu } from '/imports/ui/OverflowMenu';

 

 const [showModal] = useModal(); 

  const openLoginModal = () => {
      showModal(<AccountModal formToDisplay = "login"/>)
  }
  const openSignUpModal = () => {
      showModal(<AccountModal formToDisplay = "signup"/>)
  }
  const openPersonalProfileModal = () => {
      showModal(<PersonalProfileModal/>)
  }
  const doLogout = () => {
    sessionStorage.removeItem('frog.sessionToken');
    Meteor.logout(() => {
      resetShareDBConnection();
      window.location.reload();}); 
  }
  
const AccountButtons = () => {
    if (getUserType() === 'Anonymous') {
        return (
            <RowButton onClick = {openSignUpModal} icon={<LockOutlinedIcon fontSize = "small" />}>Create an account </RowButton>
            <RowDivider/>
            <RowButton onClick = {doLogout} icon={<LockOutlinedIcon fontSize="small" />}> Logout</RowButton>
            


        )
    }
    else if (getUserType() === 'Legacy'){
        return (
            <RowButton onClick = {openSignUpModal} icon={<LockOutlinedIcon fontSize="small" />}>Upgrade your account </RowButton>
            <RowDivider/>
            <RowButton onClick = {doLogout} icon={<LockOutlinedIcon fontSize="small" />}> Logout</RowButton>
            
        )
    }

    else if (getUserType() === 'Verified'){
        return (
            <RowButton onClick = {openPersonalProfileModal} icon={<Edit fontSize="small" />}>View/Edit Profile</RowButton>
            <RowDivider/>
            <RowButton onClick = {doLogout} icon={<LockOutlinedIcon fontSize="small" />}> Logout</RowButton>
            
        )
    }
}
 export const TopBarAccountsWrapper = ({title, menuItems}: TopBarWrapperPropsT ) => {
    return (
        <TopBar
         navigation={<Breadcrumb  paths={[{title}]} />}
         actions = {
        <OverflowMenu button={<Button variant = 'minimal' icon={<MoreHorizRounded />} />}>
            {menuItems && menuItems.map((item, index) => {
                const Icon = item.icon; 
                return (
                <RowButton icon = {<Icon fontSize = "small"/>} onClick = {item.callback} >{item.title} </RowButton>
                
                ) })}
        
        </OverflowMenu>
            
          
         <OverflowMenu button={<Button variant = 'minimal' icon={<SupervisedUserCircle />} />}>
          <RowTitle>Logged in as {getUsername()}</RowTitle>
          <RowDivider/>
         
          <AccountButtons/>
        
        </OverflowMenu>
     
         }
         />
    )
}
