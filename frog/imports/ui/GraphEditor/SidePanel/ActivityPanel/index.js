// @flow
import * as React from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Activities } from '/imports/api/activities';
import ChooseActivity from './ChooseActivity';
import EditActivity from './EditActivity';

export default withTracker(({ id }) => ({ activity: Activities.findOne(id) }))(
  ({ activity, setDelete, importList, setImportList, setIdRemove }) => {
    if (!activity) {
      return null;
    }
    if (activity.activityType) {
      return <EditActivity activity={activity} />;
    } else {
      return (
        <ChooseActivity
          {...{ setDelete, setIdRemove, importList, setImportList, activity }}
        />
      );
    }
  }
);
