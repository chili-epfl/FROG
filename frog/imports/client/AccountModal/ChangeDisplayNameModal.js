import * as React from 'react';
import { Modal, useModal } from '/imports/ui/Modal';
import { useToast } from '/imports/ui/Toast';
import { Meteor } from 'meteor/meteor';
import ChangeDisplayNameForm from './ChangeDisplayNameForm';

const ChangeDisplayNameModal = () => {
  const [showToast, hideToast] = useToast();
  const [_1, hideModal] = useModal();

  const modalCallback = () => {
    // hides the toast which has the same key as the parameter
    hideToast();
    hideModal();
  };

  const onChangeDisplayName = newDisplayName => {
    Meteor.call('change.displayname', newDisplayName, err => {
      if (err) showToast(err.reason, 'error');
      else {
        showToast('Success! Display name changed', 'success');
        hideModal();
      }
    });
  };

  return (
    <Modal title="" actions={[{ title: 'Cancel', callback: modalCallback }]}>
      <ChangeDisplayNameForm onChangeDisplayName={onChangeDisplayName} />
    </Modal>
  );
};
export default ChangeDisplayNameModal;
