// @flow

import * as React from 'react';
import ReactLoadable from 'react-loadable';

export const Loadable = ({
  loader,
  componentDescription
}: {
  loader: void => Promise<*>,
  componentDescription: string
}) =>
  ReactLoadable({
    loader,
    loading(props) {
      if (props.error) {
        console.error(props.error);
        return <div>React Loader error! {componentDescription}</div>;
      } else if (props.timedOut) {
        return <div>React Loader Timed Out! {componentDescription}</div>;
      } else {
        return null;
      }
    },
    timeout: 10000
  });
