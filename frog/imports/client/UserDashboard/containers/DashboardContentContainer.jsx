import * as React from 'react';
import { DashboardSideBar } from '/imports/client/UserDashboard/components/DashboardSideBar';
import { RecentsPage } from '/imports/client/UserDashboard/components/RecentsPage';
import { DraftsPage } from '/imports/client/UserDashboard/components/DraftsPage';
import { TemplatesPage } from '/imports/client/UserDashboard/components/TemplatesPage';
import { ArchivesPage } from '/imports/client/UserDashboard/components/ArchivesPage';
import { AdminsPage } from '/imports/client/UserDashboard/components/AdminsPage';
import { SessionsPage } from '/imports/client/UserDashboard/components/SessionsPage';
import {
  DraftsListT,
  SessionListT,
  TemplatesListT
} from '/imports/ui/Types/types';
import { clearAllTemplates } from '/imports/api/templates';
import { getUser } from '/imports/api/users';

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
  const [activePage, setActivePage] = React.useState(
    draftsList.length === 0 ? 'Sessions' : 'Recents'
  );

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
            viewCallback={setActivePage}
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

      case 'Admin Control':
        return <AdminsPage history={history} />;

      default:
        return (
          <RecentsPage
            sessionsList={sortedSessionsList}
            draftsList={sortedDraftsList}
            templatesList={sortedTemplatesList}
            actionCallback={() => history.push('/teacher')}
            viewCallback={setActivePage}
          />
        );
    }
  };

  const [userAdmin, setUserAdmin] = React.useState(false);

  React.useEffect(() => {
    Meteor.call('check.admin', (err, res) => {
      if (err) {
        console.info(err);
      }
      setUserAdmin(res);
    });
  }, []);

  return (
    <DashboardSideBar
      callbackView={setActivePage}
      activePage={activePage}
      history={history}
      showSessions={draftsList.length === 0 || activePage === 'Sessions'}
      showDrafts={draftsList.length > 0}
      showTemplates={templatesList.length > 0}
      showArchives={
        archives.drafts.length > 0 ||
        archives.sessions.length > 0 ||
        archives.templates.length > 0
      }
      showAdmin={userAdmin}
    >
      <ComponentToRender />
    </DashboardSideBar>
  );
};
