// @flow

import React from 'react';
import { Modal } from '/imports/ui/Modal';

/**
 * This modal displays an error message when accessing an archived wiki
 */
export default () => {
  return (
    <Modal title="Wiki Locked" actions={[]}>
      This wiki has been locked and you do not have access to its contents.
    </Modal>
  );
};
