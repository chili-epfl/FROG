// @flow

import { compose, withHandlers, withState } from 'recompose';

export const withVisibility: Function = compose(
  withState('visible', 'setVisibility', false),
  withHandlers({
    toggleVisibility: ({ setVisibility }) => x => {
      if (typeof x === 'boolean') {
        setVisibility(x);
      } else {
        setVisibility(n => !n);
      }
    }
  })
);
