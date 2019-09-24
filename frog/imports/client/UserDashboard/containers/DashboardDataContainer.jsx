import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Graphs } from '/imports/api/graphs';
import { Sessions } from '/imports/api/sessions';
import { Templates } from '/imports/api/templates';
import { DashboardContentContainer } from './DashboardContentContainer';
import {
  parseDraftData,
  parseSessionData,
  parseTemplateData
} from '/imports/client/UserDashboard/data-utils/helpers';
import {
  DraftsListT,
  SessionListT,
  TemplatesListT,
  ArchivesListT
} from '/imports/ui/Types/types';

type DashboardDataContainerPropT = {
  history: RouterHistory,
  draftsList: DraftsListT,
  sessionsList: SessionListT,
  templatesList: TemplatesListT,
  archivesListTemplates: ArchivesListT,
  archivesListSessions: ArchivesListT
};

const DashboardDataContainer = ({
  history,
  draftsList,
  sessionsList,
  templatesList,
  archivesListSessions,
  archivesListTemplates
}: DashboardDataContainerPropT) => {
  const parsedDraftsList = parseDraftData(draftsList, history);
  const parsedSessionsList = parseSessionData(sessionsList, history);
  const parsedTemplatesList = parseTemplateData(templatesList, history);
  const parsedArchivesList = [
    ...parseDraftData(archivesListTemplates, history),
    ...parseSessionData(archivesListSessions, history)
  ];
  return (
    <DashboardContentContainer
      history={history}
      draftsList={parsedDraftsList}
      sessionsList={parsedSessionsList}
      templatesList={parsedTemplatesList}
      archivesList={parsedArchivesList}
    />
  );
};

export default withTracker(props => {
  const draftsList = Graphs.find({ archived: null }).fetch();
  const sessionsList = Sessions.find({ archived: null }).fetch();
  const templatesList = Templates.find({}).fetch();

  const archivesListTemplates = Graphs.find({ archived: true }).fetch();
  const archivesListSessions = Sessions.find({ archived: true }).fetch();

  return {
    ...props,
    draftsList,
    sessionsList,
    templatesList,
    archivesListSessions,
    archivesListTemplates
  };
})(DashboardDataContainer);
