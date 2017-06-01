// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { activityTypesObj } from '../../activityTypes';
import { ActivityData, reactiveFn } from '../../api/activityData';
import { createLogger } from '../../api/logs';
import { saveProduct } from '../../api/products';
import { Objects } from '../../api/objects';
import { Activities, mergeDataOnce } from '../../api/activities';
import ReactiveHOC from './ReactiveHOC';

const Runner = ({ activity, object }) => {
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
    mergeDataOnce(activity._id, activity.data);
    const ActivityToRun = ReactiveHOC(activityType.dataStructure, activity._id)(
      activityType.ActivityRunner
    );
    return (
      <ActivityToRun
        configData={activity.data}
        object={object}
        userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
        logger={logger}
        saveProduct={saveProduct(activity._id)}
      />
    );
  }
  return <p>NULL OBJECT</p>;
};

export default createContainer(({ activityId }) => {
  const o = Objects.findOne({ activityId });
  const object = o ? o.data : null;

  const activity = Activities.findOne(activityId);

  return { activity, object };
}, Runner);
