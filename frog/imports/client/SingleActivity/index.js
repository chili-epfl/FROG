// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { Clear } from '@material-ui/icons';

import { Logo } from '/imports/ui/Logo';
import { Button } from '/imports/ui/Button';

import { store } from './store';
import { BaseLayout } from './components/ui/BaseLayout';
import { SelectTemplateContainer } from './containers/SelectTemplateContainer';
import { ConfigureTemplateContainer } from './containers/ConfigureTemplateContainer';

const SingleActivity = observer(() => {
  let CurrentStep;
  switch (store.currentStep) {
    case 0:
      CurrentStep = SelectTemplateContainer;
      break;
    case 1:
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
          <Button variant="minimal" icon={<Clear />} />
        </div>
      }
    >
      <CurrentStep />
    </BaseLayout>
  );
});

export default SingleActivity;
