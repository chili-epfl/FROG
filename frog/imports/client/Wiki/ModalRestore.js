// @flow

import * as React from 'react';
import { Modal } from 'frog-utils';

type ModalRestorePropsT = {
  pages: Object,
  onSelect: (pageId: string) => void,
  hideModal: () => void
};

const ModalRestore = ({ hideModal, pages, onSelect }: ModalRestorePropsT) => {
  return (
    <Modal
      title="Select a page to restore"
      actions={[{ title: 'Cancel', callback: hideModal }]}
    >
      <ul>
        {pages.map(pageObj => {
          const pageId = pageObj.id;
          const pageTitle = pageObj.title;

          return (
            <li
              key={pageId}
              style={{
                fontSize: '14px',
                cursor: 'pointer'
              }}
              onClick={() => {
                onSelect(pageId);
                hideModal();
              }}
            >
              {pageTitle}
            </li>
          );
        })}
      </ul>
    </Modal>
  );
};

export default ModalRestore;
