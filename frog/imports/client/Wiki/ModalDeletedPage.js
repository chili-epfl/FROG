// @flow

import React from 'react';
import { useToast } from 'frog-utils';
import { Modal } from './components/Modal';

type ModalDeletedPagePropsT = {
  pageTitle: string,
  hideModal: () => void,
  onRestorePage: () => void,
  onCreateNewPage: () => void
};

/**
 * This modal allows the user to restore a page, by restoring it directly,
 * or creating a new one.
 */
export default ({
  hideModal,
  onRestorePage,
  onCreateNewPage,
  pageTitle
}: ModalDeletedPagePropsT) => {
  const [showToast] = useToast();
  return (
    <Modal
      title={pageTitle}
      actions={[
        {
          title: 'Cancel',
          callback: hideModal
        },
        {
          title: 'Restore page',
          primary: true,
          callback: () => {
            onRestorePage();
            showToast('Page restored', 'success');
            hideModal();
          }
        },
        {
          title: 'Create new page',
          primary: true,
          callback: () => {
            onCreateNewPage();
            showToast('New page created', 'success');
            hideModal();
          }
        }
      ]}
    >
      Do you want to restore the old deleted page or create a new one?
    </Modal>
  );
};
