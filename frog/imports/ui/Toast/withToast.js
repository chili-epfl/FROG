// @flow

import * as React from 'react';

import { useToast } from './useToast';
import { type ShowToastFunctionT, type HideToastFunctionT } from './types';

/**
 * HOC that adds ability to create/hide toasts via provided prop functions
 */
export const withToast = <T: {}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<
  $Diff<
    T,
    {
      showToast: ShowToastFunctionT | void,
      hideToast: HideToastFunctionT | void
    }
  >
> => {
  return (
    props: $Diff<
      T,
      {
        showToast: ShowToastFunctionT | void,
        hideToast: HideToastFunctionT | void
      }
    >
  ) => {
    const [showToast, hideToast] = useToast();
    // Displays the provided Component and adds two methods to control toasts to its
    // props.
    return <Component {...props} showToast={showToast} hideToast={hideToast} />;
  };
};
