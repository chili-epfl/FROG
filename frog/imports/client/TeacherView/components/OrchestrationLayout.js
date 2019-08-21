// @flow

import * as React from 'react';

import { Clear } from '@material-ui/icons';

import { Sidebar } from '/imports/ui/Sidebar';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { Logo } from '/imports/ui/Logo';
import { RowButton } from '/imports/ui/RowItems';
import { TopBar } from '/imports/ui/TopBar';
import { Breadcrumb } from '/imports/ui/Breadcrumb';

type OrchestrationLayoutProps = {
  orchestrationControl: React.Element<*>,
  children: React.Element<*>
};

const OrchestrationLayout = (props: OrchestrationLayoutProps) => {
  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <Logo />
          {props.orchestrationControl}
        </Sidebar>
      }
      content={
        <>
          <TopBar navigation={<Breadcrumb paths={['Button', 'Stuff']} />} />
          {props.children}
        </>
      }
    />
  );
};

export default OrchestrationLayout;
