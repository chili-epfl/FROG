// @flow

import * as React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import { useModal } from './useModal';
import type { ShowModalFunctionT, HideModalFunctionT } from './types';

export type ActionsT = Array<{
  title: string,
  primary?: boolean,
  callback: () => void
}>;

type ModalPropsT = {
  title: string,
  children:
    | ((
        showModal: ShowModalFunctionT,
        hideModal: HideModalFunctionT
      ) => React.Node)
    | React.Node,
  actions: ((hideModal: HideModalFunctionT) => ActionsT) | ActionsT
};

/** Provides a standard modal view */
export const Modal = (props: ModalPropsT) => {
  const [showModal, hideModal] = useModal();

  const { title } = props;

  const children =
    typeof props.children === 'function'
      ? props.children(showModal, hideModal)
      : props.children;

  const actions =
    typeof props.actions === 'function'
      ? props.actions(hideModal)
      : props.actions;

  return (
    <>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions.map(action => (
          <Button color={action.primary && 'primary'} onClick={action.callback}>
            {action.title}
          </Button>
        ))}
      </DialogActions>
    </>
  );
};
