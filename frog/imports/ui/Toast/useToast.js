// @flow

import * as React from 'react';
import { useSnackbar } from 'notistack';
import { IconButton, Button } from '@material-ui/core';
import { Clear } from '@material-ui/icons';

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
    const key = enqueueSnackbar(message, {
      action: (
        <>
          {actions &&
            actions.map(action => (
              <Button
                key={action.title}
                color="inherit"
                onClick={() => {
                  if (action.callback) action.callback();
                  closeSnackbar(key);
                }}
              >
                {action.title}
              </Button>
            ))}
          <IconButton color="inherit" onClick={() => closeSnackbar(key)}>
            <Clear />
          </IconButton>
        </>
      ),
      variant
    });
    return key;
  };

  const hideToast = closeSnackbar;

  return [showToast, hideToast];
};
