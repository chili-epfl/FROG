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
  title?: string,
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

  // User can provide a function accepting show/hideModal, or can pass React nodes
  // directly
  const children =
    typeof props.children === 'function'
      ? props.children(showModal, hideModal)
      : props.children;

  // User can provide a function accepting show/hideModal, or can pass actions
  // directly
  const actions =
    typeof props.actions === 'function'
      ? props.actions(hideModal)
      : props.actions;

  return (
    <>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {actions.map(action => (
          <Button
            key={action.title}
            color={action.primary && 'primary'}
            onClick={action.callback}
          >
            {action.title}
          </Button>
        ))}
      </DialogActions>
    </>
  );
};
