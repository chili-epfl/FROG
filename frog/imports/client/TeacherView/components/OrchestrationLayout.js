// @flow

import * as React from 'react';

import { makeStyles } from '@material-ui/core';

import { Sidebar } from '/imports/ui/Sidebar';
import { PopupLayout } from '/imports/ui/Layout/PopupLayout';

const useStyle = makeStyles(() => ({
  contentWrapper: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap'
  }
}));

type OrchestrationLayoutProps = {
  sessionSteps: React.Element<*>,
  studentView: React.Element<*>,
  orchestrationControl: React.Element<*>,
  topBar: React.Element<*>,
  graphView: React.Element<*>,
  children: React.Element<*>
};

const OrchestrationLayout = (props: OrchestrationLayoutProps) => {
  const classes = useStyle();
  return (
    <PopupLayout
      header={props.topBar}
      sidebar={
        <Sidebar>
          {props.orchestrationControl}
          {props.sessionSteps}
          {props.studentView}
        </Sidebar>
      }
      content={<div className={classes.contentWrapper}>{props.children}</div>}
      extra={props.graphView}
    />
  );
};

export default OrchestrationLayout;
