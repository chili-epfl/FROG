// @flow

import * as _ from 'lodash';
import * as React from 'react';
import { withRouter, Route, Switch } from 'react-router-dom';

import { Clear } from '@material-ui/icons';

import { Logo } from '/imports/ui/Logo';
import { Button } from '/imports/ui/Button';

import { goToHomepage } from './store/navigation';
import { getTemplates } from './store/templates';

import { BaseLayout } from './components/ui/BaseLayout';

import { SelectTemplateContainer } from './containers/SelectTemplateContainer';
import { ConfigureTemplateContainer } from './containers/ConfigureTemplateContainer';

const SingleActivity = _.flow(withRouter)(({ history }) => {
  const availableTemplates = React.useMemo(getTemplates, [getTemplates]);

  return (
    <BaseLayout
      left={<Logo />}
      right={
        <div style={{ marginTop: '16px' }}>
          <Button
            variant="minimal"
            icon={<Clear />}
            onClick={() => goToHomepage(history)}
          />
        </div>
      }
    >
      <Switch>
        <Route
          path={[
            ...availableTemplates[0].map(listing => `/wizard/${listing.id}`),
            ...availableTemplates[1].map(listing => `/wizard/${listing.id}`)
          ]}
          component={ConfigureTemplateContainer}
        />
        <Route component={SelectTemplateContainer} />
      </Switch>
    </BaseLayout>
  );
});

export default SingleActivity;
