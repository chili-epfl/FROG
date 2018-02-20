// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Activities } from '/imports/api/activities';
import ChooseActivity from './ChooseActivity';
import EditActivity from './EditActivity';

export default withTracker(({ id }) => ({ activity: Activities.findOne(id) }))(
  ({ activity }) =>
    activity.activityType && activity.activityType !== '' ? (
      <EditActivity activity={activity} />
    ) : (
      <ChooseActivity activity={activity} />
    )
);
