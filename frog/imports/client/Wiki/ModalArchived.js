// @flow

import React from 'react';
import { Modal } from './components/Modal';

/**
 * This modal displays an error message when accessing an archived wiki
 */
export default () => {
  return (
    <Modal title="Wiki Archived" actions={[]}>
      This wiki has been archived and you do not have access to its contents.
    </Modal>
  );
};
