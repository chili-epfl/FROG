// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { MosaicWindow } from 'react-mosaic-component';
import {
  generateReactiveFn,
  focusStudent,
  getMergedExtractedUnit
} from 'frog-utils';

import { activityTypesObj } from '../../activityTypes';
import { createLogger } from '../../api/logs';
import { Objects } from '../../api/objects';
import doGetInstances from '../../api/doGetInstances';
import ReactiveHOC from './ReactiveHOC';
import { connection } from '../App/index';

const Runner = ({ activity, sessionId, object, single, stream }) => {
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
  if (studentSoc && activity.groupingKey) {
    groupingValue = studentSoc[activity.groupingKey];
  } else if (activity.plane === 3) {
    groupingValue = 'all';
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
      stream={stream}
      groupingValue={groupingValue}
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

class RunnerWithStream extends Component {
  state: { stream: any };
  mounted: boolean;
  doc: any;

  constructor(props: Object) {
    super(props);
    this.state = { stream: null };
  }

  componentDidMount() {
    this.initStream(this.props)
  }

  componentWillReceiveProps(nextProps: Object) {
    this.initStream(nextProps)
  }

  initStream(props: Object) {
    if (this.doc) {
      this.doc.destroy();
    }
    if (props.activity.streamTarget) {
      this.doc = connection.get(
        'rz',
        props.activity.streamTarget + '/all'
      );
      this.doc.subscribe();
      this.setState({ stream: generateReactiveFn(this.doc) }) // eslint-disable-line
    }
  }

  render() {
    return <Runner {...this.props} stream={this.state.stream} />;
  }
}

export default createContainer(({ activity }) => {
  const object = Objects.findOne(activity._id);
  return { object, activity };
}, RunnerWithStream);
