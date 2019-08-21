// @flow

import * as React from 'react';
import { OrchestrationContextProvider } from './context';

import OrchestrationLayout from './components/OrchestrationLayout';

import { SessionControlContainer } from './containers/SessionControlContainer';
import { StepsContainer } from './containers/StepsContainer';

type OrchestrationViewPropsT = {
  session: Object,
  activities: Object
};

export const OrchestrationView = (props: OrchestrationViewPropsT) => (
  <OrchestrationContextProvider
    session={props.session}
    activities={props.activities}
  >
    <OrchestrationLayout
      orchestrationControl={<SessionControlContainer />}
      sessionSteps={<StepsContainer />}
    >
      <div />
    </OrchestrationLayout>
  </OrchestrationContextProvider>
);
