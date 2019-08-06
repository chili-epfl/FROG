import * as React from 'react'; 
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
import { Meteor } from 'meteor/meteor';
import ChangePasswordForm from './ChangePassword';
import { Accounts } from 'meteor/accounts-base'

const ChangePasswordModal = () => {
    const [showToast, hideToast] = useToast(); 
    const [showModal, hideModal] = useModal(); 

    const modalCallback = () => {
        // hides the toast which has the same key as the parameter
        hideToast();
        hideModal();
      };

      const onResetPassword = (oldPassword, newPassword) => {
          Accounts.changePassword(oldPassword, newPassword, (err, res) => {
              if (err)
              showToast(err.reason, 'error')
              else
              showToast('Success! Password changed', 'success'); 
          })

      }; 

      return (
        <Modal title="" actions={[{ title: 'Cancel', callback: modalCallback }]}>
         <ChangePasswordForm onResetPassword = {onResetPassword}/>
        </Modal>
     
        ); 
        
}
export default ChangePasswordModal; 