// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { Clear } from '@material-ui/icons';

import { Logo } from '/imports/ui/Logo';
import { Button } from '/imports/ui/Button';

import { store } from './store';
import { BaseLayout } from './components/ui/BaseLayout';
import { SelectTemplateContainer } from './containers/SelectTemplateContainer';

const SingleActivity = observer(() => {
  return (
    <BaseLayout
      left={<Logo />}
      right={
        <div style={{ marginTop: '16px' }}>
          <Button variant="minimal" icon={<Clear />} />
        </div>
      }
    >
      <SelectTemplateContainer />
    </BaseLayout>
  );
});

export default SingleActivity;
