// @flow

import * as React from 'react';

export type ShowModalFunctionT = (View: React.Node) => void;

export type HideModalFunctionT = () => void;

export type ModalParentPropsT = {
  /** Displays the provided React component as a modal */
  showModal: ShowModalFunctionT,
  /** Hides the current modal */
  hideModal: HideModalFunctionT
};
