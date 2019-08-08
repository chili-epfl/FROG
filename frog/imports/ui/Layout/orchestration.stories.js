// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Details,
  Edit,
  ArrowDropDown,
  MoreVert,
  People,
  OpenInNew,
  Pause,
  SkipNext,
  SupervisedUserCircle
} from '@material-ui/icons';
import { SidebarLayout } from './SidebarLayout';
import { Breadcrumb } from '../Breadcrumb';
import { MinimalButton, RowButton, MinimalIconButton } from '../Button';
import { TopBar } from '../TopBar';
import { Sidebar, Panel } from '../Sidebar';
import { Title } from '../Sidebar/Panel/Title';
import { Logo } from '../Logo';
import { OverflowMenu } from '../OverflowMenu';
import { ActivityStatus } from '../ActivityStatus';

const SimpleWrapper = () => {
  return (
    <SidebarLayout
      sidebar={
        <Sidebar
          header={
            <>
              <Logo />
              <RowButton
                icon={<Pause fontSize="small" />}
                text="Pause sessions"
              />
              <RowButton
                icon={<SkipNext fontSize="small" />}
                text="Go to next activity"
              />
            </>
          }
        >
          <Panel title="Activities">
            <RowButton
              icon={<ActivityStatus status="completed" />}
              text="Waiting for students"
            />
            <RowButton
              icon={<ActivityStatus status="completed" />}
              text="Brainstorming"
            />
            <RowButton
              icon={<ActivityStatus status="active" />}
              text="Rich Text"
              variant="primary"
            />
            <RowButton icon={<ActivityStatus status="pending" />} text="Vote" />
            <RowButton
              icon={<ActivityStatus status="pending" />}
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
              <OverflowMenu
                button={
                  <MinimalButton
                    icon={<OpenInNew fontSize="small" />}
                    text="View activity"
                  />
                }
              >
                <RowButton
                  icon={<People fontSize="small" />}
                  text="As a teacher"
                />
                <RowButton
                  icon={<People fontSize="small" />}
                  text="As a student"
                />
              </OverflowMenu>
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
              <OverflowMenu
                button={
                  <MinimalIconButton
                    icon={<SupervisedUserCircle fontSize="small" />}
                  />
                }
              >
                <Title text="Logged in as Rachit" />
                <RowButton icon={<People fontSize="small" />} text="Profile" />
                <RowButton
                  icon={<Edit fontSize="small" />}
                  text="Customize FROG"
                />
                <RowButton text="Logout" />
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
