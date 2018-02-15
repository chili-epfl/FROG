// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';

import type {
  ActivityPackageT,
  ActivityRunnerT,
  ActivityDbT
} from 'frog-utils';
import { Sessions } from '/imports/api/sessions';
import { Dashboard } from '/imports/ui/TeacherView/Dashboard';

export const meta = {
  name: 'Dashboard activity',
  shortDesc: 'Show a dashboard from a previous activity',
  description:
    'Show a dashboard from a previous activity. This is often useful for debriefing'
};

type StateT = {
  activity: ActivityDbT,
  users: { _id: string, username: string }[],
  session: any
};

type PropsT = ActivityRunnerT;

class ActivityRunner extends React.Component<PropsT, StateT> {
  componentWillMount() {
    const { activityData: { config }, sessionId } = this.props;
    const session = Sessions.findOne(sessionId);
    Meteor.call('get.activity.for.dashboard', config.activity, (err, value) => {
      if (!err) {
        this.setState({ activity: value.activity, users: value.users });
      }
    });
    this.setState({ session });
  }

  render() {
    const { activity, session } = this.state;
    return activity && session ? (
      <Dashboard {...this.state} />
    ) : (
      <p>No data</p>
    );
  }
}

export default ({
  id: 'ac-dash',
  type: 'react-component',
  ActivityRunner,
  config: {
    type: 'object',
    required: ['activity'],
    properties: {
      activity: {
        type: 'activity',
        title: 'Applies to which activity'
      }
    }
  },
  meta
}: ActivityPackageT);
