/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { getUserType } from '/imports/api/users';
import { DashboardContentContainer } from './containers/DashboardContentContainer';
import { RecentsPage } from '/imports/ui/RecentsPage';
import { AccessDenied } from './pages/AccesDenied';
import { store } from './store/store';

export const DashboardRouter = () => {
  const isLoggedIn = getUserType() === 'Verified' || getUserType() === 'Legacy';
  const sessionsList = store.getSessionsList();
  const draftsList = store.getDraftsList();
  const actionCallback = () => {
    window.location.push('/teacher');
  };

  return (
    <Switch>
      {isLoggedIn ? (
        <React.Fragment>
          <Route
            path="/dashboard"
            exact
            render={(
              props,
              content,
              sessionsList,
              draftsList,
              actionCallback
            ) => (
              <DashboardContentContainer
                history={props.history}
                content={
                  <RecentsPage
                    sessionsList={sessionsList}
                    draftsList={draftsList}
                    actionCallback={actionCallback}
                  />
                }
              />
            )}
          />

          <Route
            path="/dashboard/recents"
            exact
            render={(
              props,
              content,
              sessionsList,
              draftsList,
              actionCallback
            ) => (
              <DashboardContentContainer
                history={props.history}
                content={
                  <RecentsPage
                    sessionsList={sessionsList}
                    draftsList={draftsList}
                    actionCallback={actionCallback}
                  />
                }
              />
            )}
          />

          <Route
            path="/dashboard/sessions"
            exact
            render={(
              props,
              content,
              sessionsList,
              draftsList,
              actionCallback
            ) => (
              <DashboardContentContainer
                history={props.history}
                content={
                  <RecentsPage
                    sessionsList={sessionsList}
                    draftsList={draftsList}
                    actionCallback={actionCallback}
                  />
                }
              />
            )}
          />

          <Route
            path="/dashboard/drafts"
            exact
            render={(
              props,
              content,
              sessionsList,
              draftsList,
              actionCallback
            ) => (
              <DashboardContentContainer
                history={props.history}
                content={
                  <RecentsPage
                    sessionsList={sessionsList}
                    draftsList={draftsList}
                    actionCallback={actionCallback}
                  />
                }
              />
            )}
          />
        </React.Fragment>
      ) : (
        <Route path="/access-denied" component={<AccessDenied />} />
      )}
    </Switch>
  );
};
