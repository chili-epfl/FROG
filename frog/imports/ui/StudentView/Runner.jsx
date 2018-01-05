// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';
import { focusStudent, getMergedExtractedUnit } from 'frog-utils';

import { activityTypesObj } from '../../activityTypes';
import { createLogger } from '../../api/logs';
import { Objects } from '../../api/objects';
import ReactiveHOC from './ReactiveHOC';

const getStructure = activity => {
  if (activity.plane === 1) {
    return 'individual';
  } else if (activity.plane === 2) {
    return { groupingKey: activity.groupingKey };
  } else {
    return 'all';
  }
};

const Runner = ({ path, activity, sessionId, object, single }) => {
  if (!activity) {
    return <p>NULL ACTIVITY</p>;
  }
  const activityType = activityTypesObj[activity.activityType];

  if (!object) {
    return null;
  }
  const socStructure = focusStudent(object.socialStructure);
  const studentSoc = socStructure[Meteor.userId()];

  let groupingValue;
  if (activity.plane === 3) {
    groupingValue = 'all';
  } else if (activity.plane === 2) {
    groupingValue = studentSoc[activity.groupingKey];
  } else {
    groupingValue = Meteor.userId();
  }
  const reactiveId = activity._id + '/' + groupingValue;

  const logger = createLogger(sessionId, groupingValue, activity);

  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activity.activityType;
  const ActivityToRun = ReactiveHOC(reactiveId)(RunComp);

  const groupingStr = activity.groupingKey ? activity.groupingKey + '/' : '';
  let title = '(' + groupingStr + groupingValue + ')';
  if (activity.plane === 1) {
    title = `(individual/${Meteor.user().username})`;
  }

  const config = activity.data;

  const activityStructure = getStructure(activity);

  const activityData = getMergedExtractedUnit(
    config,
    object.activityData,
    activityStructure,
    groupingValue,
    object.socialStructure
  );

  const stream = (value, targetpath) => {
    Meteor.call('stream', activity, groupingValue, targetpath, value);
  };

  const Torun = (
    <ActivityToRun
      activityData={activityData}
      userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
      logger={logger}
      stream={stream}
      groupingValue={groupingValue}
    />
  );

  if (single) {
    return Torun;
  } else {
    const EMPTY_ARRAY: any[] = [];
    return (
      <MosaicWindow
        toolbarControls={EMPTY_ARRAY}
        draggable={false}
        key={activity._id}
        path={path}
        title={activity.title + ' ' + title}
      >
        {Torun}
      </MosaicWindow>
    );
  }
};

export default createContainer(({ activity }) => {
  const object = Objects.findOne(activity._id);
  return { object, activity };
}, Runner);
