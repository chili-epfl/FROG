// @flow

import React from 'react';
import { AlertModal } from 'frog-utils';

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
      title={`${pageTitle} has been deleted`}
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
