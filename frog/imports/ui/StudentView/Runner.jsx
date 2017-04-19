// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { activityTypesObj } from '../../activityTypes';
import { ActivityData, reactiveFn } from '../../api/activityData';
import { Logs } from '../../api/logs';
import { saveProduct } from '../../api/products';
import { Objects } from '../../api/objects';
import { Activities } from '../../api/activities';

const Runner = ({ activity, object, reactiveKey, reactiveList }) => {
  const activityType = activityTypesObj[activity.activityType];

  const logger = data => {
    Logs.insert({
      activityId: activity._id,
      data
    });
  };

  return object
    ? <div id={activity.activityType}>
        <activityType.ActivityRunner
          configData={activity.data}
          object={object}
          userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
          logger={logger}
          saveProduct={saveProduct(activity._id)}
          reactiveFn={reactiveFn(activity._id)}
          reactiveData={{ keys: reactiveKey, list: reactiveList }}
        />
      </div>
    : <p>NULL OBJECT</p>;
};

export default createContainer(
  ({ activityId }) => {
    // there is one reactiveKey Object per groupId
    const reactiveKey = ActivityData.find({
      activityId,
      type: 'kv'
    }).fetch();

    const reactiveList = ActivityData.find({
      activityId,
      type: 'list'
    }).fetch();

    const o = Objects.findOne({ activityId });
    const object = o ? o.data : null;

    const activity = Activities.findOne({ _id: activityId });

    return { activity, object, reactiveKey, reactiveList };
  },
  Runner
);
