import * as React from 'react';
import { getUserType } from '/imports/api/users';
import LandingPage from '/imports/ui/LandingPage';
import Wizard from '/imports/client/Wizard';
import DashboardDataContainer from '/imports/client/UserDashboard/containers/DashboardDataContainer';
import AccountModal from '/imports/client/AccountModal/AccountModal';
import Dialog from '@material-ui/core/Dialog';

export const RootSwitcher = ({ history }) => {
  switch (getUserType()) {
    case 'Anonymous':
      return <LandingPage />;

    case 'Verified':
      return <DashboardDataContainer history={history} />;

    case 'Legacy':
      return (
        <>
          <Dialog open>
            <AccountModal formToDisplay="signup" variant="legacy" />
          </Dialog>
          <DashboardDataContainer history={history} />
        </>
      );

    default:
      return <Wizard />;
  }
};
