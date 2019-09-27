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
  templatesList: TemplatesListT
};

const DashboardDataContainer = ({
  history,
  draftsList,
  sessionsList,
  templatesList
}: DashboardDataContainerPropT) => {
  const parsedDraftsList = parseDraftData(draftsList, history);
  const parsedSessionsList = parseSessionData(sessionsList, history);
  const parsedTemplatesList = parseTemplateData(templatesList, history);
  return (
    <DashboardContentContainer
      history={history}
      draftsList={parsedDraftsList}
      sessionsList={parsedSessionsList}
      templatesList={parsedTemplatesList}
    />
  );
};

export default withTracker(props => {
  const draftsList = Graphs.find({}).fetch();
  const sessionsList = Sessions.find({}).fetch();
  const templatesList = Templates.find({}).fetch();

  return { ...props, draftsList, sessionsList, templatesList };
})(DashboardDataContainer);
