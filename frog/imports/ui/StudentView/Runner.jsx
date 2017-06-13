// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { activityTypesObj } from '../../activityTypes';
import { ActivityData, reactiveFn } from '../../api/activityData';
import { createLogger } from '../../api/logs';
import { saveProduct } from '../../api/products';
import { Objects } from '../../api/objects';
import { Activities } from '../../api/activities';
import { focusStudent } from 'frog-utils';
import ReactiveHOC from './ReactiveHOC';

const Runner = ({ activity, object, setTitle }) => {
  if (!activity) {
    return <p>NULL ACTIVITY</p>;
  }
  const activityType = activityTypesObj[activity.activityType];

  const logger = createLogger({
    activity: activity._id,
    activityType: activity.activityType,
    user: Meteor.userId()
  });

  if (object) {
    const socStructure = focusStudent(object.socialStructure);
    const studentSoc = socStructure[Meteor.userId()];
    let grouping;
    if (studentSoc && activity.grouping) {
      grouping = studentSoc[activity.grouping];
    } else {
      grouping = 'all';
    }
    const reactiveId = activity._id + '/' + grouping;

    const RunComp = activityType.ActivityRunner;
    RunComp.displayName = activity.activityType;
    const ActivityToRun = ReactiveHOC(activityType.dataStructure, reactiveId)(
      RunComp
    );

    const groupingStr = activity.grouping ? activity.grouping + '/' : '';
    setTitle(' (' + groupingStr + grouping + ')');

    return (
      <div>
        <ActivityToRun
          configData={activity.data || {}}
          object={object}
          userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
          logger={logger}
          saveProduct={saveProduct(activity._id)}
        />
      </div>
    );
  }
  return null;
};

export default createContainer(({ activityId }) => {
  const o = Objects.findOne(activityId);
  const object = o ? o.data : null;

  const activity = Activities.findOne(activityId);

  return { activity, object };
}, Runner);
