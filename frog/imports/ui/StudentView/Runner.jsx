// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';

import { activityTypesObj } from '../../activityTypes';
import { ActivityData, reactiveFn } from '../../api/activityData';
import { createLogger } from '../../api/logs';
import { saveProduct } from '../../api/products';
import { Objects } from '../../api/objects';
import { Activities } from '../../api/activities';
import { focusStudent } from 'frog-utils';
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

    const groupingStr = activity.grouping ? activity.grouping : '';
    const title = '(' + groupingStr + '/' + grouping + ')';

    return (
      <MosaicWindow title={activity.title + ' ' + title}>
        <ActivityToRun
          configData={activity.data || {}}
          object={object}
          userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
          logger={logger}
          saveProduct={saveProduct(activity._id)}
        />
      </MosaicWindow>
    );
  }
  return null;
};

export default createContainer(({ activityId }) => {
  const o = Objects.find(activityId).fetch();
  const object = o && o[0];
  const activity = Activities.findOne(activityId);
  return { activity, object };
}, Runner);
