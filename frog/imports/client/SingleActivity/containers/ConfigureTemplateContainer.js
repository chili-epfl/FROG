// @flow

import * as React from 'react';
import { observer } from 'mobx-react';

import { CircularProgress } from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';

import ApiForm from '/imports/client/GraphEditor/SidePanel/ApiForm';
import { Button } from '/imports/ui/Button';
import { TopBar } from '/imports/ui/TopBar';

import { store } from '../store';
import { ConfigureTemplate } from '../components/steps/ConfigureTemplate';

export const ConfigureTemplateContainer = observer(() => {
  const listing = store.selectedTemplateListing;
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
          onConfigChange={data => store.setTemplateConfig(data)}
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
                store.prevStep();
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
                store.loading ? <CircularProgress /> : <NavigateNext />
              }
              disabled={
                store.loading ||
                (store.templateConfig?.error &&
                  !!store.templateConfig?.errors.length)
              }
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
