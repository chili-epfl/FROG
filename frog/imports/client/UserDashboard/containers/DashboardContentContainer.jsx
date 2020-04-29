import * as React from 'react';
import { DashboardSideBar } from '/imports/client/UserDashboard/components/DashboardSideBar';
import { RecentsPage } from '/imports/client/UserDashboard/components/RecentsPage';
import { DraftsPage } from '/imports/client/UserDashboard/components/DraftsPage';
import { TemplatesPage } from '/imports/client/UserDashboard/components/TemplatesPage';
import { ArchivesPage } from '/imports/client/UserDashboard/components/ArchivesPage';
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
  templatesList: TemplatesListT,
  archives: Object
};
export const DashboardContentContainer = ({
  history,
  draftsList,
  sessionsList,
  templatesList,
  archives
}: DashboardContentContainerPropsT) => {
  const [selectedPage, setSelectedPage] = React.useState({
    sessionsView: false,
    draftsView: false,
    templatesView: false,
    recentsView: true,
    archivesView: false
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
      recentsView: true,
      archivesView: false
    });
  };
  const onSelectSessionsView = () => {
    setActivePage('Sessions');
    setSelectedPage({
      sessionsView: true,
      recentsView: false,
      templatesView: false,
      draftsView: false,
      archivesView: false
    });
  };
  const onSelectDraftsView = () => {
    setActivePage('Drafts');
    setSelectedPage({
      sessionsView: false,
      draftsView: true,
      templatesView: false,
      recentsView: false,
      archivesView: false
    });
  };
  const onSelectTemplatesView = () => {
    setActivePage('Templates');
    setSelectedPage({
      sessionsView: false,
      draftsView: false,
      templatesView: true,
      recentsView: false,
      archivesView: false
    });
  };

  const onSelectArchivesView = () => {
    setActivePage('Archives');
    setSelectedPage({
      sessionsView: false,
      draftsView: false,
      templatesView: false,
      recentsView: false,
      archivesView: true
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
  const sortedArchivesDrafts = React.useMemo(() => sortList(archives.drafts), [
    archives.drafts
  ]);
  const sortedArchivesSessions = React.useMemo(
    () => sortList(archives.sessions),
    [archives.sessions]
  );
  const sortedArchivesTemplates = React.useMemo(
    () => sortList(archives.templates),
    [archives.templates]
  );

  const ComponentToRender = () => {
    switch (activePage) {
      case 'Recents':
        return (
          <RecentsPage
            sessionsList={sortedSessionsList}
            draftsList={sortedDraftsList}
            templatesList={sortedTemplatesList}
            actionCallback={() => history.push('/teacher/graph/new')}
            moreCallbackSessions={onSelectSessionsView}
            moreCallbackDrafts={onSelectDraftsView}
            moreCallbackTemplates={onSelectTemplatesView}
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

      case 'Archives':
        return (
          <ArchivesPage
            archivesDrafts={sortedArchivesDrafts}
            archivesSessions={sortedArchivesSessions}
            archivesTemplates={sortedArchivesTemplates}
          />
        );

      default:
        return (
          <RecentsPage
            sessionsList={sortedSessionsList}
            draftsList={sortedDraftsList}
            templatesList={sortedTemplatesList}
            actionCallback={() => history.push('/teacher')}
            moreCallbackSessions={onSelectSessionsView}
            moreCallbackDrafts={onSelectDraftsView}
            moreCallbackTemplates={onSelectTemplatesView}
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
      callbackArchivesView={onSelectArchivesView}
      sessionsActive={draftsList.length === 0 || selectedPage.sessionsView}
      draftsActive={selectedPage.draftsView}
      recentsActive={selectedPage.recentsView}
      templatesActive={selectedPage.templatesView}
      archivesActive={selectedPage.archivesView}
      activePage={activePage}
      history={history}
      showDrafts={draftsList.length > 0}
      showTemplates={templatesList.length > 0}
      showArchives={
        archives.drafts.length > 0 ||
        archives.sessions.length > 0 ||
        archives.templates.length > 0
      }
    >
      <ComponentToRender />
    </DashboardSideBar>
  );
};
