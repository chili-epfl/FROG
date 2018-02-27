// @flow

import React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';
import { focusStudent, getMergedExtractedUnit } from 'frog-utils';

import { activityTypes, activityTypesObj } from '../../activityTypes';
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
  if (activity.plane === 3) {
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

  const actType = activityTypes.find(x => x.id === activity.activityType);
  const defaultConf =
    typeof actType !== 'undefined' ? actType.config.properties : {};
  Object.keys(defaultConf).forEach(
    x => (defaultConf[x] = defaultConf[x].default)
  );
  const config = activity.data || defaultConf;

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
  const reactiveId = activity._id + '/' + groupingValue;
  const logger = createLogger(sessionId, groupingValue, activity);
  const readOnly =
    activity.participationMode === 'readonly' &&
    Meteor.user().username !== 'teacher';

  const Torun = (
    <RunActivity
      activityTypeId={activity.activityType}
      reactiveId={reactiveId}
      logger={logger}
      stream={stream}
      username={Meteor.user().username}
      userid={Meteor.userId()}
      activityData={activityData}
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
  groupingValue: string,
  activityTypeId: string,
  readOnly?: boolean,
  sessionId: string
};

export class RunActivity extends React.Component<PropsT, {}> {
  ActivityToRun: any;

  constructor(props: PropsT) {
    super();
    const { reactiveId, activityData, activityTypeId, readOnly } = props;
    const activityType = activityTypesObj[activityTypeId];
    const RunComp = activityType.ActivityRunner;
    RunComp.displayName = activityType.id;
    const formatProduct = activityType.formatProduct;
    const transform = formatProduct
      ? x => formatProduct((activityData && activityData.config) || {}, x)
      : x => x;

    this.ActivityToRun = ReactiveHOC(
      reactiveId,
      undefined,
      transform,
      readOnly
    )(RunComp);
  }

  componentDidMount() {
    this.props.logger({ type: 'activityDidMount' });
  }

  render() {
    const Activity = this.ActivityToRun;
    return (
      <Activity
        activityData={this.props.activityData}
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
