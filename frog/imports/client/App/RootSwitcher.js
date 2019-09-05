import * as React from 'react';
import { getUserType } from '/imports/api/users';
import LandingPage from '/imports/ui/LandingPage';
import Wizard from '/imports/client/Wizard';
import DashboardDataContainer from '/imports/client/UserDashboard/containers/DashboardDataContainer';

export const RootSwitcher = ({ history }) => {
  switch (getUserType()) {
    case 'Anonymous':
      return <LandingPage />;

    case 'Verified':
      return <DashboardDataContainer history={history} />;

    case 'Legacy':
      return <DashboardDataContainer history={history} />;

    default:
      return <Wizard />;
  }
};
