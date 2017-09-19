// @flow

import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import { every } from 'lodash';
import { Sessions } from '/imports/api/sessions';
import SessionBody from './SessionBody';

class StudentViewComp extends Component {
  state: { result: string, message?: string };
  constructor(props) {
    super(props);
    this.state = { result: 'notyet' };
  }

  componentWillMount() {
    // $FlowFixMe
    Raven.setUserContext({
      user: Meteor.userId()
    });
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
      return (
        <h1>
          Error: {this.state.message}
        </h1>
      );
    }
    if (!this.props.ready) {
      return <Spinner />;
    }
    if (!this.props.session) {
      return <h1>That session is no longer available</h1>;
    }
    return <SessionBody />;
  }
}

StudentViewComp.displayName = 'StudentView';

export default createContainer(props => {
  const slug = props.match.params.slug.trim().toUpperCase();

  const collections = ['session_activities'];
  const subscriptions = collections.map(x => Meteor.subscribe(x, slug));
  return {
    session: Sessions.findOne({ slug }),
    ready: every(subscriptions.map(x => x.ready()), Boolean)
  };
}, StudentViewComp);
