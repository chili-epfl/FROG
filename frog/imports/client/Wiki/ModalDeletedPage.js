// @flow

import React from 'react';
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
  pageId,
  pageTitle
}: ModalDeletedPagePropsT) => {
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
            hideModal();
          }
        },
        {
          title: 'Create new page',
          primary: true,
          callback: () => {
            onCreateNewPage();
            hideModal();
          }
        }
      ]}
    >
      Do you want to restore the old deleted page or create a new one?
    </Modal>
  );
};
