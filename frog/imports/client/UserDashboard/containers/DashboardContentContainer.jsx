import * as React from 'react';
import { DashboardSideBar } from '/imports/client/UserDashboard/components/DashboardSideBar';
import { RecentsPage } from '/imports/client/UserDashboard/components/RecentsPage';
import { DraftsPage } from '/imports/client/UserDashboard/components/DraftsPage';
import { TemplatesPage } from '/imports/client/UserDashboard/components/TemplatesPage';
import { SessionsPage } from '/imports/client/UserDashboard/components/SessionsPage';
import {
  DraftsListT,
  SessionListT,
  TemplatesListT
} from '/imports/ui/Types/types';
import { clearAllTemplates } from '/imports/api/templates';

type DashboardContentContainerPropsT = {
  history: RouterHistory,
  draftsList: DraftsListT,
  sessionsList: SessionListT,
  templatesList: TemplatesListT
};
export const DashboardContentContainer = ({
  history,
  draftsList,
  sessionsList,
  templatesList
}: DashboardContentContainerPropsT) => {
  const [selectedPage, setSelectedPage] = React.useState({
    sessionsView: false,
    draftsView: false,
    templatesView: false,
    recentsView: true
  });
  const [activePage, setActivePage] = React.useState(
    draftsList.length === 0 ? 'Sessions' : 'Recents'
  );

  const onSelectRecentsView = () => {
    setActivePage('Recents');
    setSelectedPage({
      sessionsView: false,
      draftsView: false,
      templatesView: false,
      recentsView: true
    });
  };
  const onSelectSessionsView = () => {
    setActivePage('Sessions');
    setSelectedPage({
      sessionsView: true,
      recentsView: false,
      templatesView: false,
      draftsView: false
    });
  };
  const onSelectDraftsView = () => {
    setActivePage('Drafts');
    setSelectedPage({
      sessionsView: false,
      draftsView: true,
      templatesView: false,
      recentsView: false
    });
  };
  const onSelectTemplatesView = () => {
    setActivePage('Templates');
    setSelectedPage({
      sessionsView: false,
      draftsView: false,
      templatesView: true,
      recentsView: false
    });
  };

  const sortList = (list): SessionListT | DraftsListT | TemplatesListT => {
    return list.sort((a, b) => b.dateObj - a.dateObj);
  };
  // use cached values if the input array is the same
  const sortedSessionsList = React.useMemo(() => sortList(sessionsList), [
    sessionsList
  ]);
  const sortedDraftsList = React.useMemo(() => sortList(draftsList), [
    draftsList
  ]);
  const sortedTemplatesList = React.useMemo(() => sortList(templatesList), [
    templatesList
  ]);

  const ComponentToRender = () => {
    switch (activePage) {
      case 'Recents':
        return (
          <RecentsPage
            sessionsList={sortedSessionsList}
            draftsList={sortedDraftsList}
            actionCallback={() => history.push('/teacher/graph/new')}
            moreCallbackSessions={onSelectSessionsView}
            moreCallbackDrafts={onSelectDraftsView}
          />
        );
      case 'Sessions':
        return <SessionsPage sessionsList={sortedSessionsList} />;

      case 'Drafts':
        return (
          <DraftsPage
            draftsList={sortedDraftsList}
            actionCallback={() => history.push('/teacher/graph/new')}
          />
        );

      case 'Templates':
        return (
          <TemplatesPage
            templatesList={sortedTemplatesList}
            actionCallback={() => clearAllTemplates()}
          />
        );

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
      callbackTemplatesView={onSelectTemplatesView}
      sessionsActive={draftsList.length === 0 || selectedPage.sessionsView}
      draftsActive={selectedPage.draftsView}
      recentsActive={selectedPage.recentsView}
      templatesActive={selectedPage.templatesView}
      activePage={activePage}
      history={history}
      showDrafts={draftsList.length > 0}
      showTemplates={templatesList.length > 0}
    >
      <ComponentToRender />
    </DashboardSideBar>
  );
};
