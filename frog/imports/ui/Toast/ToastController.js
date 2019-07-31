// @flow

import * as React from 'react';
import { SnackbarProvider } from 'notistack';

type ToastControllerPropsT = {
  children: React.Node | React.Node[]
};

/**
 * HOC that adds ability to create toasts within the provided component
 */
export const ToastController = (props: ToastControllerPropsT) => (
  <SnackbarProvider
    maxSnack={3}
    dense={false}
    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    autoHideDuration={3200}
  >
    {props.children}
  </SnackbarProvider>
);
