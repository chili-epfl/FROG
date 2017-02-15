// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';

import { activityTypesObj } from '../../activityTypes';

import { ActivityData, reactiveFn } from '../../api/activityData';

import { createLogger } from '../../api/logs';
import { addProduct } from '../../api/products';

const Runner = ({ activity, object, reactiveKey, reactiveList }) => {
  const activityType = activityTypesObj[activity.activityType];

  const onCompletion = completionData => {
    addProduct(
      activity._id,
      activity.activityType,
      Meteor.userId(),
      completionData
    );
  };

  const logger = createLogger({
    activity: activity._id,
    activityType: activity.activityType,
    user: Meteor.userId()
  });

  return (
    <activityType.ActivityRunner
      config={activity.data}
      object={object}
      userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
      logger={logger}
      onCompletion={onCompletion}
      reactiveFn={reactiveFn(activity._id)}
      reactiveData={{ keys: reactiveKey, list: reactiveList }}
    />
  );
};

export default createContainer(
  props => {
    const reactiveKey = ActivityData.find({
      activityId: props.activity._id,
      type: 'kv'
    }).fetch();

    const reactiveList = ActivityData.find({
      activityId: props.activity._id,
      type: 'list'
    }).fetch();
    return { ...props, reactiveKey, reactiveList };
  },
  props => <Runner {...props} />
);
