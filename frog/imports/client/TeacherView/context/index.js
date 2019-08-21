// @flow

import * as React from 'react';

import { actions } from './actions';
import { selectors } from './selectors';

type ExtractReturnType = <R>(() => R) => R;

type OrchestrationModelT = {
  ...$Call<ExtractReturnType, typeof actions>,
  ...$Call<ExtractReturnType, typeof selectors>
};

export const OrchestrationContext = React.createContext<OrchestrationModelT>(
  {}
);

type OrchestrationContextProviderPropsT = {
  session?: Object,
  children: React.Element<*> | React.Element<*>[]
};

export const OrchestrationContextProvider = (
  props: OrchestrationContextProviderPropsT
) => {
  const orchestrationModel = React.useMemo(
    () => ({ ...actions(props.session), ...selectors(props.session) }),
    [props.session]
  );

  return (
    <OrchestrationContext.Provider value={orchestrationModel}>
      {props.session !== undefined && props.children}
    </OrchestrationContext.Provider>
  );
};
