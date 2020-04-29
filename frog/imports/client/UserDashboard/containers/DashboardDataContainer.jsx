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
  TemplatesListT
} from '/imports/ui/Types/types';

type DashboardDataContainerPropT = {
  history: RouterHistory,
  draftsList: DraftsListT,
  sessionsList: SessionListT,
  templatesList: TemplatesListT,
  archivesListTemplates: TemplatesListT,
  archivesListSessions: SessionListT
};

const DashboardDataContainer = ({
  history,
  draftsList,
  sessionsList,
  templatesList,
  archivesListDrafts,
  archivesListSessions,
  archivesListTemplates
}: DashboardDataContainerPropT) => {
  const parsedDraftsList = parseDraftData(draftsList, history);
  const parsedSessionsList = parseSessionData(sessionsList, history);
  const parsedTemplatesList = parseTemplateData(templatesList, history);
  const parsedArchives = {
    drafts: parseDraftData(archivesListDrafts, history),
    sessions: parseSessionData(archivesListSessions, history),
    templates: parseTemplateData(archivesListTemplates, history)
  };
  return (
    <DashboardContentContainer
      history={history}
      draftsList={parsedDraftsList}
      sessionsList={parsedSessionsList}
      templatesList={parsedTemplatesList}
      archives={parsedArchives}
    />
  );
};

export default withTracker(props => {
  const notArchived = { uiStatus: { $ne: 'archived' } };
  const draftsList = Graphs.find(notArchived).fetch();
  const sessionsList = Sessions.find(notArchived).fetch();
  const templatesList = Templates.find(notArchived).fetch();

  const archivesListTemplates = Templates.find({
    uiStatus: 'archived'
  }).fetch();
  const archivesListSessions = Sessions.find({ uiStatus: 'archived' }).fetch();
  const archivesListDrafts = Graphs.find({ uiStatus: 'archived' }).fetch();

  return {
    ...props,
    draftsList,
    sessionsList,
    templatesList,
    archivesListSessions,
    archivesListTemplates,
    archivesListDrafts
  };
})(DashboardDataContainer);
