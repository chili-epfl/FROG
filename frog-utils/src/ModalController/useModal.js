// @flow

import * as React from 'react';

import { ModalContext } from './ModalController';
import type { ShowModalFunctionT, HideModalFunctionT } from './types';

export const useModal = (): [ShowModalFunctionT, HideModalFunctionT] => {
  const modalContext = React.useContext(ModalContext);
  return [modalContext.showModal, modalContext.hideModal];
};
