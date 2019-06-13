//@flow

import * as React from 'react';

import {
  type ShowModalFunctionT,
  type HideModalFunctionT,
  type ModalParentPropsT
} from './types';

/**
 * HOC that adds ability to create modals via provided prop function
 */
export const withModalController = <T: {}>(
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
    // Initialize the state with an undefined View, this will ensure
    // no modal gets rendered
    const [View, updateData] = React.useState();

    // Updates the state with the provided ModalView and props
    const showModal = (View: React.Node) => updateData(View);

    const hideModal = () => updateData();

    // Displays the provided Component and adds two methods to control modals to its
    // props. Displays a modal if one is active.
    return (
      <>
        {View !== undefined ? View : null}
        <Component {...props} showModal={showModal} hideModal={hideModal} />
      </>
    );
  };
};
