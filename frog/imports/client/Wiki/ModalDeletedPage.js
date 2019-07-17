// @flow

import React from 'react';
import { AlertModal } from '/imports/frog-utils';

type ModalDeletedPagePropsT = {
  pageTitle: string,
  onRestorePage: () => void,
  onCreateNewPage: () => void
};

/**
 * This modal allows the user to restore a page, by restoring it directly,
 * or creating a new one.
 */
export default ({
  onRestorePage,
  onCreateNewPage,
  pageTitle
}: ModalDeletedPagePropsT) => {
  return (
    <AlertModal
<<<<<<< HEAD
      title={pageTitle}
=======
      title={`${pageTitle} has been deleted`}
>>>>>>> 9725f9c027bb1793dea12baea5d9cad53946fc01
      content="Do you want to restore the old deleted page or create a new one?"
      actions={[
        {
          title: 'Cancel',
          callback: () => {}
        },
        {
          title: 'Restore page',
          primary: true,
          callback: () => {
            onRestorePage();
          }
        },
        {
          title: 'Create new page',
          primary: true,
          callback: () => {
            onCreateNewPage();
          }
        }
      ]}
    />
  );
};
