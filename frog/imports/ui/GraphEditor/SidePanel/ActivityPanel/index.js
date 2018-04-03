// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Graphs } from '/imports/api/graphs';
import ChooseActivity from './ChooseActivity';
import EditActivity from './EditActivity';

export default withTracker(({ graphId, id }) => ({
  activity: Graphs.findOne({ _id: graphId }).activities.find(x => x.id === id)
}))(({ graphId, activity }) => {
  if (!activity) {
    return null;
  }
  if (activity.activityType) {
    return <EditActivity {...{ activity, graphId }} />;
  } else {
    return <ChooseActivity activity={activity} />;
  }
});
