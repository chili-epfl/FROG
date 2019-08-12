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
  SupervisedUserCircle,
  NavigateNext,
  Widgets
} from '@material-ui/icons';
import { SidebarLayout } from './SidebarLayout';
import { Breadcrumb } from '../Breadcrumb';
import { Button } from '../Button';
import { TopBar } from '../TopBar';
import { Sidebar, Panel } from '../Sidebar';
import { RowButton, RowTitle, RowDivider } from '../RowItems';
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
              <RowButton icon={<Pause fontSize="small" />}>
                Pause Session
              </RowButton>
              <RowButton icon={<SkipNext fontSize="small" />}>
                Next Activity
              </RowButton>
            </>
          }
        >
          <Panel>
            <RowTitle>Activities</RowTitle>
            <RowButton
              icon={<ActivityStatus status="completed" />}
              rightIcon={<NavigateNext fontSize="small" />}
            >
              Waiting for students
            </RowButton>
            <RowButton
              icon={<ActivityStatus status="completed" />}
              variant="primary"
              rightIcon={<NavigateNext fontSize="small" />}
            >
              Brainstorming
            </RowButton>
            <RowButton
              icon={<ActivityStatus status="active" />}
              rightIcon={<NavigateNext fontSize="small" />}
            >
              Rich Text
            </RowButton>
            <RowButton icon={<ActivityStatus status="pending" />} disabled>
              Vote
            </RowButton>
            <RowButton
              icon={<ActivityStatus status="pending" />}
              text="Reflect"
              disabled
            >
              Reflect
            </RowButton>
          </Panel>
          <Panel>
            <RowTitle>Students - by group</RowTitle>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group A
            </RowButton>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group B
            </RowButton>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group C
            </RowButton>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group D
            </RowButton>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group E
            </RowButton>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group F
            </RowButton>
            <RowButton icon={<ArrowDropDown fontSize="small" />}>
              Group G
            </RowButton>
          </Panel>
        </Sidebar>
      }
      content={
        <>
          <TopBar
            navigation={
              <Breadcrumb
                icon={<ActivityStatus status="active" />}
                paths={['Lecture #1', 'Rich Text']}
              />
            }
            actions={
              <>
                <OverflowMenu
                  button={
                    <Button icon={<SupervisedUserCircle fontSize="small" />} />
                  }
                >
                  <RowTitle>Logged in as Rachit</RowTitle>
                  <RowButton icon={<Edit fontSize="small" />}>
                    Edit Profile
                  </RowButton>
                  <RowButton icon={<Widgets fontSize="small" />}>
                    View personal wiki
                  </RowButton>
                  <RowDivider />
                  <RowButton>Logout</RowButton>
                </OverflowMenu>
              </>
            }
          />
          <TopBar
            variant="minimal"
            actions={
              <Button
                icon={<SupervisedUserCircle fontSize="small" />}
                rightIcon={<ArrowDropDown fontSize="small" />}
              >
                Filter by group
              </Button>
            }
          />
        </>
      }
    />
  );
};

storiesOf('Layout/SidebarLayout', module).add('orchestration', () => (
  <SimpleWrapper />
));
