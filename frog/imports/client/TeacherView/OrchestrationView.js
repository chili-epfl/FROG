// @flow

import * as React from 'react';
import { OrchestrationContextProvider } from './context';
import OrchestrationLayout from './components/OrchestrationLayout';
import { SessionControlContainer } from './containers/SessionControlContainer';

type OrchestrationViewPropsT = {
  session: Object
};

export const OrchestrationView = (props: OrchestrationViewPropsT) => (
  <OrchestrationContextProvider session={props.session}>
    <OrchestrationLayout orchestrationControl={<SessionControlContainer />}>
      <div />
    </OrchestrationLayout>
  </OrchestrationContextProvider>
);
