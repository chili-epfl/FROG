//@flow

import * as React from 'react';

import Modal from './Modal';

type ModalContentPropsT = {
  hideModal: () => void
};

type WithModalPropsT = {
  showModal:
    | ((Content: React.AbstractComponent<ModalContentPropsT>) => void)
    | void,
  hideModal: (() => void) | void
};

type WrapperComponentPropsT<Config: {}> = $Diff<Config, WithModalPropsT>;

const withModals = <Config: {}>(
  Component: React.AbstractComponent<Config>
): React.AbstractComponent<WrapperComponentPropsT<Config>> => {
  const ModalController = (props: WrapperComponentPropsT<Config>) => {
    const [ModalContent, updateContent] = React.useState();

    const showModal = (Content: React.AbstractComponent<ModalContentPropsT>) =>
      updateContent(ModalContent);
    const hideModal = () => updateContent(undefined);

    return (
      <>
        {ModalContent !== undefined ? (
          <Modal title="Test">
            <ModalContent hideModal={hideModal} />
          </Modal>
        ) : null}
        <Component {...props} showModal={showModal} hideModal={hideModal} />
      </>
    );
  };
  return ModalController;
};

export default withModals;
