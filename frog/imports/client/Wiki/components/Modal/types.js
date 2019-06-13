//@flow

import * as React from 'react';

export type ShowModalFunctionT = (View: React.Node) => void;

export type HideModalFunctionT = () => void;

export type ModalParentPropsT = {
  showModal: ShowModalFunctionT,
  hideModal: HideModalFunctionT
};
