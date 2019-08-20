// @flow

import * as React from 'react';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router';

import { Clear } from '@material-ui/icons';

import { Logo } from '/imports/ui/Logo';
import { Button } from '/imports/ui/Button';

import { store, STEP_SELECT_TEMPLATE, STEP_CONFIGURE_TEMPLATE } from './store';
import { BaseLayout } from './components/ui/BaseLayout';
import { SelectTemplateContainer } from './containers/SelectTemplateContainer';
import { ConfigureTemplateContainer } from './containers/ConfigureTemplateContainer';

const SingleActivity = observer(history => {
  React.useEffect(() => store.setHistory(history), []);

  let CurrentStep;
  switch (store.currentStep) {
    case STEP_SELECT_TEMPLATE:
      CurrentStep = SelectTemplateContainer;
      break;
    case STEP_CONFIGURE_TEMPLATE:
      CurrentStep = ConfigureTemplateContainer;
      break;
    default:
      throw new Error('Invalid step number');
  }

  return (
    <BaseLayout
      left={<Logo />}
      right={
        <div style={{ marginTop: '16px' }}>
          <Button
            variant="minimal"
            icon={<Clear />}
            onClick={() => store.goBackToHomepage()}
          />
        </div>
      }
    >
      <CurrentStep />
    </BaseLayout>
  );
});

export default withRouter(SingleActivity);
