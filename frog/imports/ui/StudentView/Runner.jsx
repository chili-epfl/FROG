// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';
import { focusStudent, getMergedExtractedUnit } from 'frog-utils';

import { activityTypesObj, activityRunners } from '../../activityTypes';
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
  if (!object) {
    return null;
  }
  const socStructure = focusStudent(object.socialStructure);
  const studentSoc = socStructure[Meteor.userId()];

  let groupingValue;
  if ([3, 4].includes(activity.plane)) {
    groupingValue = 'all';
  } else if (activity.plane === 2) {
    groupingValue = studentSoc[activity.groupingKey];
  } else {
    groupingValue = Meteor.userId();
  }

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

  const stream = value => {
    Meteor.call('stream', activity, groupingValue, value);
  };
  const reactiveId = activity._id + '/' + groupingValue;
  const logger = createLogger(sessionId, groupingValue, activity);
  const readOnly =
    activity.participationMode === 'readonly' &&
    Meteor.user().username !== 'teacher';

  const Torun = (
    <RunActivity
      key={reactiveId}
      activityTypeId={activity.activityType}
      activityId={activity._id}
      reactiveId={reactiveId}
      logger={logger}
      stream={stream}
      username={Meteor.user().username}
      userid={Meteor.userId()}
      activityData={activityData}
      groupingKey={activity.groupingKey}
      groupingValue={groupingValue}
      sessionId={sessionId}
      readOnly={readOnly}
    />
  );

  if (single) {
    return Torun;
  } else {
    return (
      <MosaicWindow
        toolbarControls={[<div />]}
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
  rawData?: any
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

    const RunComp = activityRunners[activityType.id];
    RunComp.displayName = activityType.id;
    const formatProduct = activityType.formatProduct;
    const transform = formatProduct
      ? x =>
          formatProduct(
            this.props.activityData?.config || {},
            x,
            groupingKey,
            username
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
        userInfo={{
          name: this.props.username,
          id: this.props.userid
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
