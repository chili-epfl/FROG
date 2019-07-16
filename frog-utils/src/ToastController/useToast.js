// @flow

import * as React from 'react';
import { useSnackbar } from 'notistack';
import { Button } from '@material-ui/core';

import type {
  ShowToastFunctionT,
  HideToastFunctionT,
  ActionT,
  VariantT
} from './types';

/** Provides controls to show/hide toasts */
export const useToast = (): [ShowToastFunctionT, HideToastFunctionT] => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showToast = (
    message: string,
    variant?: VariantT,
    actions?: ActionT[]
  ) => {
    return enqueueSnackbar(message, {
      action:
        actions &&
        actions.map(action => (
          <Button
            onClick={() => {
              if (action.callback) action.callback();
              closeSnackbar();
            }}
          >
            {action.title}
          </Button>
        )),
      variant
    });
  };

  const hideToast = closeSnackbar;

  return [showToast, hideToast];
};
