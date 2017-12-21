// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { createContainer } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import { every } from 'lodash';
import { UserStatus } from 'meteor/mizzao:user-status';

import { Sessions } from '/imports/api/sessions';
import SessionBody from './SessionBody';

const once = { already: false };

class StudentViewComp extends Component {
  state: { result: string, message?: string };
  constructor(props) {
    super(props);
    this.state = { result: 'notyet' };
  }

  componentWillMount() {
    this.checkSessionJoin(this.props.match.params.slug);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.slug !== this.props.match.params.slug) {
      this.checkSessionJoin(nextProps.match.params.slug);
    }
  }

  checkSessionJoin(rawSlug: string) {
    const slug = rawSlug.trim().toUpperCase();
    if (
      !(
        Meteor.user().joinedSessions &&
        Meteor.user().joinedSessions.includes(slug)
      )
    ) {
      Meteor.call('session.join', slug, (err, result) => this.setState(result));
    }
  }

  render() {
    if (this.state.result === 'error') {
      return <h1>Error: {this.state.message}</h1>;
    }
    if (!this.props.ready) {
      return <Spinner />;
    }
    if (!this.props.session) {
      return <h1>That session is no longer available</h1>;
    }
    if (this.props.session.state === 'WAITINGFORNEXT') {
      return (
        <div>
          <h1>Waiting for next activity</h1>
          <Spinner />
        </div>
      );
    }
    return <SessionBody />;
  }
}

StudentViewComp.displayName = 'StudentView';

const monitor = () => {
  if (Meteor.userId()) {
    try {
      UserStatus.startMonitor({
        threshold: 30000,
        interval: 1000,
        idleOnBlur: true
      });
    } catch (_) {
      console.warn('Error connecting to status monitoring, trying again');
      window.setTimeout(monitor, 5000);
    }
  } else {
    UserStatus.stopMonitor();
  }
};

export default createContainer(props => {
  if (!once.already) {
    Tracker.autorun(() => {
      if (Meteor.userId()) {
        monitor();
      }
    });
    once.already = true;
  }

  const slug = props.match.params.slug.trim().toUpperCase();

  const collections = ['session_activities'];
  const subscriptions = collections.map(x => Meteor.subscribe(x, slug));
  return {
    session: Sessions.findOne({ slug }),
    ready: every(subscriptions.map(x => x.ready()), Boolean)
  };
}, StudentViewComp);
