// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';
import { focusStudent, getMergedExtractedUnit } from 'frog-utils';
import { cloneDeep } from 'lodash';

import { activityTypesObj } from '../../activityTypes';
import { createLogger } from '../../api/logs';
import { Objects } from '../../api/objects';
import { Activities } from '../../api/activities';
import doGetInstances from '../../api/doGetInstances';
import ReactiveHOC from './ReactiveHOC';

const Runner = ({ activity, object, single }) => {
  if (!activity) {
    return <p>NULL ACTIVITY</p>;
  }
  const activityType = activityTypesObj[activity.activityType];

  const logger = createLogger({
    activity: activity._id,
    activityType: activity.activityType,
    user: Meteor.userId()
  });

  if (!object) {
    return null;
  }
  const socStructure = focusStudent(object.socialStructure);
  const studentSoc = socStructure[Meteor.userId()];

  let groupingValue;
  if (studentSoc && activity.groupingKey) {
    groupingValue = studentSoc[activity.groupingKey];
  } else if (activity.plane === 3) {
    groupingValue = 'all';
  } else {
    groupingValue = Meteor.userId();
  }
  const reactiveId = activity._id + '/' + groupingValue;

  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activity.activityType;
  const ActivityToRun = ReactiveHOC(
    cloneDeep(activityType.dataStructure),
    reactiveId
  )(RunComp);

  const groupingStr = activity.groupingKey ? activity.groupingKey + '/' : '';
  let title = '(' + groupingStr + groupingValue + ')';
  if (activity.plane === 1) {
    title = `(individual/${Meteor.user().username})`;
  }

  const config = activity.data;
  const activityStructure = doGetInstances(activity, object).structure;

  const activityData = getMergedExtractedUnit(
    config,
    object.activityData,
    activityStructure,
    groupingValue,
    object.socialStructure
  );

  const Torun = (
    <ActivityToRun
      activityData={activityData}
      userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
      logger={logger}
    />
  );

  if (single) {
    return Torun;
  } else {
    return (
      <MosaicWindow title={activity.title + ' ' + title}>
        {Torun}
      </MosaicWindow>
    );
  }
};

export default createContainer(({ activityId, single }) => {
  const object = Objects.findOne(activityId);
  const activity = Activities.findOne(activityId);
  return { activity, object, single };
}, Runner);
