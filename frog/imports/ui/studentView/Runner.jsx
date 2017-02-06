import React from 'react';
import { Meteor } from 'meteor/meteor';

import { TimedComponent } from 'frog-utils';

import { activityTypesObj } from '../../activityTypes';
import { objectIndex } from '../../../lib/utils';

import { createLogger } from '../../api/logs';
import { Sessions } from '../../api/sessions';
import { Results } from '../../api/activities';
import { addProduct } from '../../api/products';

import CollabRunner from './CollabRunner.jsx';

const Runner = ({ activity }) => {
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
      logger={logger}
      onCompletion={onCompletion}
      data={data}
    />
  );
};

const TimedRunner = ({ activity, timeNow }) => {
  const duration = activity.data.duration;
  const createdAt = Sessions.findOne({ activity: activity._id }).startedAt;
  // This will give a number with one digit after the decimal dot (xx.x):
  const seconds = (duration - (timeNow - createdAt) / 1000).toFixed(1);

  if (duration === 0) {
    return <Runner activity={activity} />;
  }
  if (seconds < 0) {
    return <h1>Time-out for this activity</h1>;
  }
  return (
    <div>
      <p>This activity will end in <b>{seconds} seconds</b>.</p>
      <Runner activity={activity} />
    </div>
  );
};

export default TimedComponent(TimedRunner, 50);
