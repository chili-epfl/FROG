import React from 'react';
import { cloneDeep } from 'lodash';
import { uuid } from 'frog-utils';
import Modal from 'react-modal';

import { activityTypesObj } from '../../activityTypes';
import { connection } from '../App/index';
import ReactiveHOC from '../StudentView/ReactiveHOC';
import doGetInstances from '../../api/doGetInstances';

export default ({ activityTypeId }) => {
  const activityType = activityTypesObj[activityTypeId || 'ac-video'];
  const RunComp = activityType.ActivityRunner;
  RunComp.displayName = activityType;
  const ActivityToRun = ReactiveHOC(
    cloneDeep(activityType.dataStructure),
    uuid(),
    activityType.dataStructure | {}
  )(RunComp);

  const config = activityType.meta.exampleData;

  return (
    <ActivityToRun
      activityData={{ config, activityData: activityType.dataStructure || {} }}
      userInfo={{ name: Meteor.user().username, id: Meteor.userId() }}
      logger={() => {}}
    />
  );
};
