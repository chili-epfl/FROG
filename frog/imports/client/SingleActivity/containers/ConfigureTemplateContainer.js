// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { NavigateNext, NavigateBefore } from '@material-ui/icons';

import ApiForm from '/imports/client/GraphEditor/SidePanel/ApiForm';
import { Button } from '/imports/ui/Button';
import { TopBar } from '/imports/ui/TopBar';
import { Progress } from '/imports/ui/Progress';

import { store, STEP_SELECT_TEMPLATE } from '../store';
import { ConfigureTemplate } from '../components/steps/ConfigureTemplate';

export const ConfigureTemplateContainer = observer(() => {
  const listing = store.templateListing;
  if (!listing) {
    throw new Error('Listing cannot be undefined');
  }

  return (
    <>
      <ConfigureTemplate
        name={listing.name}
        shortDesc={listing.shortDesc}
        description={listing.description}
      >
        <ApiForm
          activityType={listing.id}
          data={store.templateConfig}
          onConfigChange={data => {
            store.setTemplateConfig(data.config);
          }}
          hidePreview
          noOffset
        />
      </ConfigureTemplate>
      <div
        style={{
          position: 'fixed',
          width: '100%',
          padding: '0 64px',
          bottom: 0,
          left: 0,
          zIndex: 900
        }}
      >
        <TopBar
          size="large"
          navigation={
            <Button
              icon={<NavigateBefore />}
              onClick={() => {
                store.setCurrentStep(STEP_SELECT_TEMPLATE);
              }}
              disabled={store.loading}
            >
              Back
            </Button>
          }
          actions={
            <Button
              variant="primary"
              rightIcon={
                store.loading ? <Progress size="small" /> : <NavigateNext />
              }
              disabled={store.loading || store.templateConfig?.invalid}
              onClick={() => {
                store.createSession();
              }}
            >
              Create
            </Button>
          }
        />
      </div>
    </>
  );
});
