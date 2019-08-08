// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  PlayArrow,
  Details,
  Add,
  Edit,
  ArrowDropDown,
  MoreVert,
  People,
  OpenInNew,
  Pause,
  SkipNext
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
        <Sidebar header={<Logo />}>
          <Panel>
            <RowButton
              icon={<Pause fontSize="small" />}
              text="Pause sessions"
            />
            <RowButton
              icon={<SkipNext fontSize="small" />}
              text="Go to next activity"
            />
          </Panel>
          <Panel title="Activities">
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Waiting for students"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Brainstorming"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Rich Text"
              variant="primary"
            />
            <RowButton icon={<ArrowDropDown fontSize="small" />} text="Vote" />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Reflect"
            />
          </Panel>
          <Panel title="Students - by group">
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group A"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group B"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group C"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group D"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group E"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group F"
            />
            <RowButton
              icon={<ArrowDropDown fontSize="small" />}
              text="Group G"
            />
          </Panel>
        </Sidebar>
      }
      content={
        <TopBar
          navigation={
            <Breadcrumb
              icon={<Details />}
              paths={['Lecture #1', 'Rich Text']}
            />
          }
          actions={
            <>
              <MinimalButton
                icon={<OpenInNew fontSize="small" />}
                text="Open orchestration view"
              />
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
                  onClick={() => console.log('test')}
                />
              </OverflowMenu>
            </>
          }
        />
      }
    />
  );
};

storiesOf('Layout/SidebarLayout', module).add('orchestration', () => (
  <SimpleWrapper />
));
