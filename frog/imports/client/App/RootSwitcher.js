import * as React from 'react';
import { getUserType } from '/imports/api/users';
import { LandingPage } from '/imports/ui/LandingPage';
import SingleActivity from '../SingleActivity';
import { DashboardRouter } from '/imports/client/UserDashboard/DashboardRouter';

export const RootSwitcher = ({ history }) => {
  switch (getUserType()) {
    case 'Anonymous':
      return <LandingPage />;

    case 'Verified':
      history.push('/dashboard');
      return <DashboardRouter />;

    case 'Legacy ':
      history.push('/dashboard');
      return <DashboardRouter />;

    default:
      return <SingleActivity />;
  }
};
