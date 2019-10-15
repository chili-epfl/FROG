// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';
import * as Sentry from '@sentry/browser';

import { focusStudent, getMergedExtractedUnit } from '/imports/frog-utils';
import { activityTypesObj } from '/imports/activityTypes';
import { activityRunners } from '/imports/client/activityRunners';
import { createLogger } from '/imports/api/logs';
import { Objects } from '/imports/api/objects';
import { LocalSettings } from '/imports/api/settings';
import { Sessions } from '/imports/api/sessions';
import { getUsername } from '/imports/api/users';

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

const Runner = ({ path, activity, sessionId, object, paused }) => {
  Sentry.addBreadcrumb({
    category: 'studentview',
    data: { activity, sessionId, object }
  });
  if (!activity) {
    return <p>NULL ACTIVITY</p>;
  }
  if (!object) {
    return null;
  }
  const session = Sessions.findOne(sessionId);
  if (!session) {
    console.error('No session');
    return null;
  }
  const isTeacher = Meteor.userId() === session.ownerId;

  const socStructure = focusStudent(object.socialStructure);
  const studentSoc = socStructure[Meteor.userId()];
  const instanceMembers =
    !isTeacher && activity.plane === 2 && studentSoc
      ? object.socialStructure[activity.groupingKey][
          studentSoc[activity.groupingKey]
        ]
          .map(x => object.globalStructure?.students[x])
          .sort()
      : undefined;

  let groupingValue;
  if ([3, 4].includes(activity.plane)) {
    groupingValue = 'all';
  } else if (activity.plane === 2 && !isTeacher) {
    groupingValue = studentSoc[activity.groupingKey];
  } else {
    groupingValue = Meteor.userId();
  }

  const groupingStr = activity.groupingKey ? activity.groupingKey + '/' : '';
  let title = '(' + groupingStr + groupingValue + ')';
  // only specify grouping key if it differs from "group"
  if (activity.plane === 2 && isTeacher) {
    title = `(Group activity${
      activity.groupingKey !== 'group'
        ? `, grouped by ${activity.groupingKey}`
        : ''
    }, PREVIEW)`;
  }
  if (activity.plane === 1) {
    title = isTeacher
      ? '(Individual activity, PREVIEW)'
      : `(individual/${getUsername(undefined, { activityRunner: true }) ||
          ''})`;
  }
  if (activity.plane === 3) {
    title = '(Whole class)';
  }

  const config = activity.data;

  // if teacher is previewing p1/p2 activity, grab data from first instance
  const activityStructure = getStructure(activity);
  let activityData;
  if (
    groupingValue !== 'all' &&
    isTeacher &&
    object.globalStructure.studentIds.length === 0
  ) {
    activityData = {
      data: activityTypesObj[activity.activityType].dataStructure || {},
      config: activity.data
    };
  } else {
    activityData = getMergedExtractedUnit(
      config,
      object.activityData,
      activityStructure,
      groupingValue !== 'all' && isTeacher
        ? Object.keys(object.activityData.payload)[0]
        : groupingValue,
      object.socialStructure
    );
  }

  const stream = value => {
    Meteor.call('stream', activity, groupingValue, value);
  };
  const reactiveId = activity._id + '/' + groupingValue;
  const logger = createLogger(sessionId, groupingValue, activity);
  const readOnly = activity.participationMode === 'readonly' && !isTeacher;
  Sentry.addBreadcrumb({
    category: 'studentview',
    data: {
      activityData,
      groupingKey: activity.groupingKey,
      groupingValue,
      readOnly
    }
  });

  const Torun = (
    <div
      style={
        LocalSettings.scaled
          ? {
              height: '100%',
              width: '100%',
              zoom: LocalSettings.scaled + '%'
            }
          : { height: '100%', width: '100%' }
      }
    >
      <RunActivity
        key={reactiveId}
        activityTypeId={activity.activityType}
        {...{
          reactiveId,
          logger,
          stream,
          activityData,
          groupingValue,
          sessionId,
          readOnly
        }}
        activityId={activity._id}
        username={
          getUsername(undefined, { activityRunner: true }) || 'No Username'
        }
        userid={Meteor.userId()}
        groupingKey={activity.groupingKey}
        instanceMembers={instanceMembers}
      />
    </div>
  );

  return (
    <MosaicWindow
      toolbarControls={[<div key={1} />]}
      draggable={false}
      key={activity._id}
      path={path}
      title={activity.title + ' ' + title + (paused ? ' - PAUSED' : '')}
    >
      {Torun}
    </MosaicWindow>
  );
};

type PropsT = {
  reactiveId: string,
  logger: Function,
  activityData?: Object | null,
  username: string,
  userid: string,
  stream: Function,
  groupingKey: string,
  groupingValue: string,
  activityTypeId: string,
  readOnly?: boolean,
  sessionId: string,
  activityId: string,
  rawData?: any,
  instanceMembers: string[]
};

export class RunActivity extends React.Component<PropsT, {}> {
  ActivityToRun: any;

  constructor(props: PropsT) {
    super();
    const {
      reactiveId,
      activityTypeId,
      readOnly,
      activityId,
      userid,
      sessionId,
      groupingKey,
      groupingValue,
      stream,
      username,
      rawData
    } = props;
    const activityType = activityTypesObj[activityTypeId];
    const meta: {
      createdInActivity: string,
      createdByUser: string,
      createdByInstance?: Object,
      sessionId: string
    } = {
      createdInActivity: activityId,
      createdByUser: userid,
      sessionId
    };
    if (groupingKey) {
      meta.createdByInstance = { [groupingKey]: groupingValue };
    }

    const acRunnerId = activityType.id.startsWith('li-')
      ? 'ac-single-li'
      : activityType.id;
    const RunComp = activityRunners[acRunnerId];
    if (!RunComp) {
      Sentry.captureException('No valid activity id ' + activityType.id);
      return <h1>'Not valid activity id ' + activityType.id</h1>;
    }
    RunComp.displayName = activityType.id;
    const formatProduct = LocalSettings.api
      ? activityType.formatProduct
      : undefined;
    const transform = formatProduct
      ? x =>
          formatProduct(
            this.props.activityData?.config || {},
            x,
            groupingKey,
            username,
            undefined,
            -1
          )
      : undefined;

    this.ActivityToRun = ReactiveHOC(
      reactiveId,
      undefined,
      readOnly,
      undefined,
      meta,
      undefined,
      stream,
      sessionId,
      transform,
      rawData
    )(RunComp);
  }

  componentDidMount() {
    this.props.logger({ type: 'activityDidMount' });
  }

  render() {
    const Activity = this.ActivityToRun;
    return (
      <Activity
        key={this.props.reactiveId}
        activityData={this.props.activityData}
        activityId={this.props.activityId}
        instanceMembers={this.props.instanceMembers}
        userInfo={{
          name: this.props.username,
          id: this.props.userid,
          role:
            Sessions.findOne(this.props.sessionId)?.ownerId === Meteor.userId()
              ? 'teacher'
              : 'student'
        }}
        logger={this.props.logger}
        stream={this.props.stream}
        groupingValue={this.props.groupingValue}
        sessionId={this.props.sessionId}
      />
    );
  }
}

export default withTracker(({ activity }) => {
  const object = Objects.findOne(activity._id);
  return { object, activity };
})(Runner);
