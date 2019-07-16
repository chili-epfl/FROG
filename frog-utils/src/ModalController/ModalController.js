// @flow

import * as React from 'react';
import Dialog from '@material-ui/core/Dialog';

import { type ShowModalFunctionT, type HideModalFunctionT } from './types';

export const ModalContext = React.createContext<{
  showModal: ShowModalFunctionT,
  hideModal: HideModalFunctionT
}>({});

type ModalControllerPropsT = {
  children: React.Node | React.Node[]
};

/**
 * HOC that adds ability to create modals via provided prop function
 */
export const ModalController = (props: ModalControllerPropsT) => {
  // Initialize the state with an null Modal, this will ensure
  // no modal gets rendered
  const [Modal, updateModal] = React.useState<React.Node>(null);

  // Updates the state with the provided Modal
  const showModal = (modal: React.Node) => {
    updateModal(modal);
  };

  const hideModal = () => updateModal(null);

  // Displays the provided Component and adds two methods to control modals to its
  // props. Displays a modal if one is active.
  return (
    <ModalContext.Provider
      value={{
        showModal,
        hideModal
      }}
    >
      {Modal !== null && <Dialog open>{Modal}</Dialog>}
      {props.children}
    </ModalContext.Provider>
  );
};
