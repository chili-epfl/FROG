// @flow

import * as React from 'react';
import { OpenInNew } from '@material-ui/icons';

import { Button } from '/imports/ui/Button';
import { ActivityContainer } from '/imports/client/StudentView/SessionBody';

import { PreviewView } from '../../components/PreviewView';
import { OrchestrationContext } from '../../context';

type PreviewContainerPropsT = {
  currentActivity: string,
  paused: boolean
};

export const PreviewContainer = (props: PreviewContainerPropsT) => {
  const session = React.useContext(OrchestrationContext);

  return (
    <PreviewView
      overlays={
        <Button
          variant="raised"
          icon={<OpenInNew />}
          onClick={session.openProjector}
        >
          Open in new tab
        </Button>
      }
    >
      <ActivityContainer
        paused={props.paused}
        sessionId={session.id}
        activities={props.currentActivity}
      />
    </PreviewView>
  );
};
