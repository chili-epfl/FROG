// @flow

import * as _ from 'lodash';
import * as React from 'react';
import { withRouter, Prompt } from 'react-router-dom';

import { NavigateNext, NavigateBefore } from '@material-ui/icons';

import ApiForm from '/imports/client/GraphEditor/SidePanel/ApiForm';
import { Button } from '/imports/ui/Button';
import { TopBar } from '/imports/ui/TopBar';
import { Progress } from '/imports/ui/Progress';

import {
  goToTemplateSelect,
  getTemplateId,
  goToOrchestration
} from '../store/navigation';
import { getTemplateById } from '../store/templates';
import { createSession } from '../store/session';

import { ConfigureTemplate } from '../components/steps/ConfigureTemplate';

import { store } from '../../GraphEditor/store';

export const ConfigureTemplateContainer = _.flow(withRouter)(
  ({ history, match }) => {
    const templateId = getTemplateId(match.url);

    const listing = React.useMemo(() => getTemplateById(templateId), [
      templateId
    ]);

    const [numberOfEdits, setNumberOfEdits] = React.useState(0);
    const [config, setConfig] = React.useState(store.wizardConfig);
    const [waitingForSessionCreation, setWaiting] = React.useState(false);

    const onSubmit = () => {
      setWaiting(true);
      createSession(templateId, config).then((slug, err) => {
        if (err) {
          window.alert(err.message);
        } else {
          goToOrchestration(history, slug);
        }
      });
    };

    return (
      <>
        <Prompt
          when={numberOfEdits > 1 && !waitingForSessionCreation}
          message="If you leave this page, your draft configuration will be lost. Are you sure you want to leave this page?"
        />
        <ConfigureTemplate
          name={listing.name}
          shortDesc={listing.shortDesc}
          description={listing.description}
        >
          <ApiForm
            activityType={listing.id}
            onConfigChange={data => {
              setNumberOfEdits(numberOfEdits + 1);
              setConfig(data.config);
            }}
            hidePreview
            noOffset
          />
        </ConfigureTemplate>
        <div
          style={{
            position: 'fixed',
            width: '100%',
            bottom: 0,
            left: 0,
            zIndex: 900
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1024px',
              margin: '0 auto'
            }}
          >
            <TopBar
              size="large"
              navigation={
                <Button
                  icon={<NavigateBefore />}
                  onClick={() => {
                    goToTemplateSelect(history);
                  }}
                  disabled={waitingForSessionCreation}
                >
                  Back
                </Button>
              }
              actions={
                <Button
                  variant="primary"
                  rightIcon={
                    waitingForSessionCreation ? (
                      <Progress size="small" />
                    ) : (
                      <NavigateNext />
                    )
                  }
                  disabled={waitingForSessionCreation || config?.invalid}
                  onClick={onSubmit}
                >
                  Create
                </Button>
              }
            />
          </div>
        </div>
      </>
    );
  }
);
