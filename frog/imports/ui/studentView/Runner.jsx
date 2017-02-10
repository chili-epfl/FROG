import React from 'react';
import { Meteor } from 'meteor/meteor';

import { activityTypesObj } from '../../activityTypes';
import { objectIndex } from '../../../lib/utils';

import { createLogger } from '../../api/logs';
import { Results } from '../../api/activities';
import { addProduct } from '../../api/products';

import CollabRunner from './CollabRunner.jsx';

const Runner = ({ activity, object }) => {
  const activityType = activityTypesObj[activity.activityType];
  const onCompletion = completionData => {
    addProduct(
      activity._id,
      activity.activityType,
      Meteor.userId(),
      completionData
    );
  };
  const inputRaw = Results.findOne({
    activityId: activity._id,
    type: 'product'
  });
  const data = inputRaw && inputRaw.result;

  const social = Results.findOne({ activityId: activity._id, type: 'social' });

  // if no social operator, assign entire class to group 0
  const groupId = social ? objectIndex(social.result)[Meteor.userId()] : 0;

  if (activityType.meta.mode === 'collab') {
    return (
      <CollabRunner
        activity={activity}
        groupId={groupId}
        onCompletion={onCompletion}
        data={data}
      />
    );
  }
  const logger = createLogger({
    activity: activity._id,
    activityType: activity.activityType,
    user: Meteor.userId()
  });
  return (
    <activityType.ActivityRunner
      config={activity.data}
      object={object}
      userId={Meteor.userId()}
      logger={logger}
      onCompletion={onCompletion}
      data={data}
    />
  );
};

export default ({ activity, object }) => (
  <Runner activity={activity} object={object} />
);
