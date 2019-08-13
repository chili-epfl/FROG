import * as React from 'react';

import {
  Edit,
  ArrowDropDown,
  Pause,
  SkipNext,
  SupervisedUserCircle,
  Widgets
} from '@material-ui/icons';
import { SidebarLayout } from '/imports/ui/Layout/SidebarLayout';
import { Breadcrumb } from '/imports/ui/Breadcrumb';
import { Button } from '/imports/ui/Button';
import { TopBar } from '/imports/ui/TopBar';
import { Sidebar, Panel } from '/imports/ui/Sidebar';
import { RowButton, RowTitle, RowDivider } from '/imports/ui/RowItems';
import { Logo } from '/imports/ui/Logo';
import { OverflowMenu } from '/imports/ui/OverflowMenu';
import { ActivityStatus } from '/imports/ui/ActivityStatus';
import StepsContainer from './StepsContainer';
import { nextActivity } from '/imports/api/engine';
import { ActivityContainer } from '/imports/client/StudentView/SessionBody';
import { Activities } from '/imports/api/activities';
import { restartSession } from '/imports/api/sessions';

const SimpleWrapper = ({ activities, session }) => {
  const currentActivities = session.openActivities.map(x =>
    Activities.findOne(x)
  );

  const ready = !currentActivities.some(x => x === undefined);
  return (
    <SidebarLayout
      sidebar={
        <Sidebar
          header={
            <>
              <Logo />
              <RowButton
                onClick={() => restartSession(session)}
                icon={<Pause fontSize="small" />}
              >
                Restart Session
              </RowButton>
              <RowButton
                onClick={() => nextActivity(session._id)}
                icon={<SkipNext fontSize="small" />}
              >
                Next Activity
              </RowButton>
            </>
          }
        >
          <StepsContainer
            activities={activities}
            timeInGraph={session.timeInGraph}
            openActivities={session.openActivities}
          />
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
          {ready && (
            <div style={{ height: 'calc(100% - 100px)' }}>
              <ActivityContainer
                session={session}
                activities={currentActivities}
              />
            </div>
          )}
        </>
      }
    />
  );
};

export default SimpleWrapper;
