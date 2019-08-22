// @flow

import * as React from 'react';

import { makeStyles } from '@material-ui/core';

import { Sidebar } from '/imports/ui/Sidebar';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { Logo } from '/imports/ui/Logo';
import { TopBar } from '/imports/ui/TopBar';

const useStyle = makeStyles(() => ({
  contentWrapper: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column nowrap'
  }
}));

type OrchestrationLayoutProps = {
  sessionSteps: React.Element<*>,
  orchestrationControl: React.Element<*>,
  slugButton: React.Element<*>,
  graphView: React.Element<*>,
  children: React.Element<*>
};

const OrchestrationLayout = (props: OrchestrationLayoutProps) => {
  const classes = useStyle();
  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <Logo />
          {props.orchestrationControl}
          {props.sessionSteps}
        </Sidebar>
      }
      content={
        <div className={classes.contentWrapper}>
          <TopBar actions={<>{props.slugButton}</>} />
          {props.children}
        </div>
      }
      extra={props.graphView}
    />
  );
};

export default OrchestrationLayout;
