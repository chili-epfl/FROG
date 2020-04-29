// @flow

import * as React from 'react';
import { storiesOf } from '@storybook/react';
import {
  Edit,
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
import { PopupLayout } from './PopupLayout';

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
          footer={
            <Panel>
              <RowTitle>Instructions</RowTitle>
              <div style={{ height: '300px' }} />
            </Panel>
          }
        >
          <Panel>
            <RowTitle>Steps</RowTitle>
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
        </Sidebar>
      }
      contentTopBar={
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
        </>
      }
      content={<></>}
      extra={
        <TopBar
          variant="minimal"
          navigation={
            <>
              <Button variant="primary">Graph</Button>
              <Button variant="minimal">Instruction</Button>
            </>
          }
        />
      }
    />
  );
};

storiesOf('UI/Layout', module).add('SidebarLayout', () => <SimpleWrapper />);

storiesOf('UI/Layout', module).add('PopupLayout', () => (
  <PopupLayout
    header={<div style={{ height: '100%', background: '#eee' }}>Header</div>}
    sidebar={<div style={{ height: '100%', background: '#ddd' }}>SideBar</div>}
    content={<div style={{ height: '100%', background: '#ccc' }}>Content</div>}
    extra={<div style={{ height: '100%', background: '#bbb' }}>Extra</div>}
  />
));
