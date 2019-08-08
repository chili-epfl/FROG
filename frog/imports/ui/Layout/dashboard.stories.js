// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  PlayArrow,
  Details,
  Add,
  Edit,
  ArrowDropDown,
  MoreVert,
  People,
  OpenInNew
} from '@material-ui/icons';
import { SidebarLayout } from './SidebarLayout';
import { Breadcrumb } from '../Breadcrumb';
import { MinimalButton, RowButton, MinimalIconButton } from '../Button';
import { TopBar } from '../TopBar';
import { Sidebar, Panel } from '../Sidebar';
import { Logo } from '../Logo';
import { OverflowMenu } from '../OverflowMenu';

const SimpleWrapper = () => {
  return (
    <SidebarLayout
      sidebar={
        <Sidebar
          header={<Logo />}
          footer={
            <RowButton
              icon={<Add />}
              text="Create a new session"
              size="large"
            />
          }
        >
          <Panel>
            <RowButton
              icon={<Details fontSize="small" />}
              text="Recent"
              variant="primary"
            />
            <RowButton icon={<Edit fontSize="small" />} text="My Drafts" />
            <RowButton
              icon={<PlayArrow fontSize="small" />}
              text="My Sessions"
              active
            />
          </Panel>
          <Panel title="Classes">
            <RowButton icon={<ArrowDropDown fontSize="small" />} text="2019" />
            <RowButton icon={<ArrowDropDown fontSize="small" />} text="2018" />
            <RowButton icon={<ArrowDropDown fontSize="small" />} text="2017" />
          </Panel>
        </Sidebar>
      }
      content={
        <TopBar
          navigation={<Breadcrumb icon={<Details />} paths={['Recent']} />}
          actions={
            <>
              <MinimalButton text="Clear recents" />
              <OverflowMenu
                button={
                  <MinimalIconButton icon={<MoreVert fontSize="small" />} />
                }
              >
                <RowButton
                  icon={<Edit fontSize="small" />}
                  text="Customize interface"
                />
                <RowButton
                  icon={<People fontSize="small" />}
                  text="Edit classroom"
                />
                <RowButton
                  icon={<OpenInNew fontSize="small" />}
                  text="Export to SVG"
                />
              </OverflowMenu>
            </>
          }
        />
      }
    />
  );
};

storiesOf('Layout/SidebarLayout', module).add('dashboard', () => (
  <SimpleWrapper />
));
