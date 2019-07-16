// @flow

import * as React from 'react';

import { useModal } from './useModal';
import { type ShowModalFunctionT, type HideModalFunctionT } from './types';

/**
 * HOC that adds ability to create modals via provided prop function
 */
export const withModal = <T: {}>(
  Component: React.AbstractComponent<T>
): React.AbstractComponent<
  $Diff<
    T,
    {
      showModal: ShowModalFunctionT | void,
      hideModal: HideModalFunctionT | void
    }
  >
> => {
  return (
    props: $Diff<
      T,
      {
        showModal: ShowModalFunctionT | void,
        hideModal: HideModalFunctionT | void
      }
    >
  ) => {
    const [showModal, hideModal] = useModal();
    // Displays the provided Component and adds two methods to control modals to its
    // props.
    return <Component {...props} showModal={showModal} hideModal={hideModal} />;
  };
};
