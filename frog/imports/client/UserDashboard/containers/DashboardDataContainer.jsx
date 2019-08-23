import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Graphs } from '/imports/api/graphs';
import { Sessions } from '/imports/api/sessions';
import { DashboardContentContainer } from './DashboardContentContainer';
import {
  parseDraftData,
  parseSessionData
} from '/imports/client/UserDashboard/data-utils/helpers';
import { DraftsListT, SessionListT } from '/imports/ui/Types/types';

type DashboardDataContainerPropT = {
  history: RouterHistory,
  draftsList: DraftsListT,
  sessionsList: SessionListT
};

const DashboardDataContainer = ({
  history,
  draftsList,
  sessionsList
}: DashboardDataContainerPropT) => {
  const parsedDraftsList = parseDraftData(draftsList, history);
  const parsedSessionsList = parseSessionData(sessionsList, history);
  return (
    <DashboardContentContainer
      history={history}
      draftsList={parsedDraftsList}
      sessionsList={parsedSessionsList}
    />
  );
};

export default withTracker(props => {
  const draftsList = Graphs.find({}).fetch();
  const sessionsList = Sessions.find({}).fetch();

  return { ...props, draftsList, sessionsList };
})(DashboardDataContainer);
