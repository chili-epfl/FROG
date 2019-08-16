import * as React from 'react';
import { getUserType } from '/imports/api/users';
import { LandingPage } from '/imports/ui/LandingPage';
import SingleActivity from '../SingleActivity';
import { DashboardContentContainer } from '/imports/client/UserDashboard/containers/DashboardContentContainer';

export const RootSwitcher = ({ history }) => {
  switch (getUserType()) {
    case 'Anonymous':
      return (<LandingPage />); 

    case 'Verified':
      return (<DashboardContentContainer history = {history} />);

    case 'Legacy ':
      return (<DashboardContentContainer history = {history} />);

    default:
      return( <SingleActivity />);
  }
};
