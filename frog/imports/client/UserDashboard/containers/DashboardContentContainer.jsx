import * as React from 'react';
import { DashboardSideBar } from '../components/DashboardSideBar';
import { store } from '../store/store';
import { RecentsPage } from '../components/RecentsPage';
import { DraftsPage } from '../components/DraftsPage';
import { SessionsPage } from '../components/SessionsPage';

export const DashboardContentContainer = ({ history }) => {
  const [selectedPage, setSelectedPage] = React.useState({
    sessionsView: false,
    draftsView: false,
    recentsView: true
  });
  const sessionsList = store.getSessionsList();
  const draftsList = store.getDraftsList();

  const onSelectRecentsView = () => {
    store.setActive('Recents');
    setSelectedPage({
      sessionsView: false,
      draftsView: false,
      recentsView: true
    });
  };
  const onSelectSessionsView = () => {
    store.setActive('Sessions');
    setSelectedPage({
      sessionsView: true,
      recentsView: false,
      draftsView: false
    });
  };
  const onSelectDraftsView = () => {
    store.setActive('Drafts');
    setSelectedPage({
      sessionsView: false,
      draftsView: true,
      recentsView: false
    });
  };

  const ComponentToRender = () => {
    switch (store.currentPage) {
      case 'Recents':
        return (
          <RecentsPage
            sessionsList={sessionsList}
            draftsList={draftsList}
            actionCallback={() => history.push('/teacher')}
          />
        );
      case 'Sessions':
        return <SessionsPage sessionsList={sessionsList} />;

      case 'Drafts':
        return <DraftsPage draftsList={draftsList} />;

      default:
        return (
          <RecentsPage
            sessionsList={sessionsList}
            draftsList={draftsList}
            actionCallback={() => history.push('/teacher')}
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
    >
      <ComponentToRender />
    </DashboardSideBar>
  );
};
