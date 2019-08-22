import * as React from 'react';
import { DashboardSideBar } from '/imports/client/UserDashboard/components/DashboardSideBar';
import { RecentsPage } from '/imports/client/UserDashboard/components/RecentsPage';
import { DraftsPage } from '/imports/client/UserDashboard/components/DraftsPage';
import { SessionsPage } from '/imports/client/UserDashboard/components/SessionsPage';
import { DraftsListT, SessionsListT } from '/imports/ui/Types/types';

type DashboardContentContainerPropsT = {
  history: RouterHistory,
  draftsList: DraftsListT,
  sessionsList: SessionsListT
};
export const DashboardContentContainer = ({
  history,
  draftsList,
  sessionsList
}: DashboardContentContainerPropsT) => {
  const [selectedPage, setSelectedPage] = React.useState({
    sessionsView: false,
    draftsView: false,
    recentsView: true
  });
  const [activePage, setActivePage] = React.useState('Recents');

  const onSelectRecentsView = () => {
    setActivePage('Recents');
    setSelectedPage({
      sessionsView: false,
      draftsView: false,
      recentsView: true
    });
  };
  const onSelectSessionsView = () => {
    setActivePage('Sessions');
    setSelectedPage({
      sessionsView: true,
      recentsView: false,
      draftsView: false
    });
  };
  const onSelectDraftsView = () => {
    setActivePage('Drafts');
    setSelectedPage({
      sessionsView: false,
      draftsView: true,
      recentsView: false
    });
  };

  const sortList = (list): SessionListT | DraftsListT => {
    return list.sort((a, b) => b.dateObj - a.dateObj);
  };
  // use cached values if the input array is the same
  const sortedSessionsList = React.useMemo(() => sortList(sessionsList), [
    sessionsList
  ]);
  const sortedDraftsList = React.useMemo(() => sortList(draftsList), [
    draftsList
  ]);

  const ComponentToRender = () => {
    switch (activePage) {
      case 'Recents':
        return (
          <RecentsPage
            sessionsList={sortedSessionsList}
            draftsList={sortedDraftsList}
            actionCallback={() => history.push('/teacher')}
            moreCallbackSessions={onSelectSessionsView}
            moreCallbackDrafts={onSelectDraftsView}
          />
        );
      case 'Sessions':
        return <SessionsPage sessionsList={sortedSessionsList} />;

      case 'Drafts':
        return <DraftsPage draftsList={sortedDraftsList} />;

      default:
        return (
          <RecentsPage
            sessionsList={sortedSessionsList}
            draftsList={sortedDraftsList}
            actionCallback={() => history.push('/teacher')}
            moreCallbackSessions={onSelectSessionsView}
            moreCallbackDrafts={onSelectDraftsView}
          />
        );
    }
  };

  return (
    <DashboardSideBar
      callbackSessionsView={onSelectSessionsView}
      callbackRecentsView={onSelectRecentsView}
      callbackDraftsView={onSelectDraftsView}
      sessionsActive={selectedPage.sessionsView}
      draftsActive={selectedPage.draftsView}
      recentsActive={selectedPage.recentsView}
      activePage={activePage}
      history={history}
    >
      <ComponentToRender />
    </DashboardSideBar>
  );
};
