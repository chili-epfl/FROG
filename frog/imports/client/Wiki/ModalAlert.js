// @flow
import React from 'react';
import { Modal } from './components/Modal';

type ModalAlertPropsT = {
  title: string,
  children: React.Node,
  callback: () => void
};

export default ({ title, callback, children }: ModalAlertPropsT) => {
  return (
    <Modal title={title} actions={[{ title: 'OK', callback }]}>
      {children}
    </Modal>
  );
};
