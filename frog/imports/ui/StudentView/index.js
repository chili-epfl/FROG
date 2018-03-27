// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { withTracker } from 'meteor/react-meteor-data';
import Spinner from 'react-spinner';
import { every } from 'lodash';
import { UserStatus } from 'meteor/mizzao:user-status';
import styled from 'styled-components';
import { Accounts } from 'meteor/accounts-base';

import { Sessions } from '/imports/api/sessions';
import { GlobalSettings } from '/imports/api/globalSettings';
import SessionBody from './SessionBody';

const once = { already: false };

const DashLink = styled.div`
  position: fixed;
  bottom: 0px;
  right: 0px;
  font-size: 3em;
  color: black !important;
  cursor: pointer;
`;

const Logout = styled.div`
  && {
    position: fixed;
    top: 0px;
    right: 0px;
    font-size: 2em;
    color: black !important;
    cursor: pointer;
  }
`;

type StudentViewCompPropsT = {
  match: Object,
  token?: { value: string },
  slug: string
};

class StudentViewComp extends React.Component<
  StudentViewCompPropsT,
  { result: string, message?: string }
> {
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
      Meteor.call('session.join', slug, (err, result) => {
        if (err) console.error(err);
        this.setState(result);
      });
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
      return <Spinner />;
    }
    if (this.props.session.state === 'WAITINGFORNEXT') {
      return (
        <div>
          <h1>Waiting for next activity</h1>
          <Spinner />
        </div>
      );
    }
    return (
      <React.Fragment>
        <SessionBody />
        {Meteor.user() && (
          <div className="logout">
            <Logout
              onClick={() => {
                Meteor.logout();
                Accounts._unstoreLoginToken();
                window.notReady();
              }}
            >
              {Meteor.user().username}
              <span className="glyphicon glyphicon-log-out" />
            </Logout>
          </div>
        )}
        {Meteor.user() &&
          Meteor.user().username === 'teacher' && (
            <div className="bootstrap">
              <DashLink>
                <a
                  href={`/?login=teacher&token=${(this.props.token &&
                    this.props.token.value) ||
                    ''}`}
                  target="_blank"
                  className="glyphicon glyphicon-dashboard"
                />
              </DashLink>
            </div>
          )}
      </React.Fragment>
    );
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

export default withTracker(props => {
  if (!once.already) {
    Tracker.autorun(() => {
      if (Meteor.userId()) {
        monitor();
      }
    });
    once.already = true;
  }

  const slug = props.match.params.slug.trim().toUpperCase();

  const collections = ['session_activities', 'globalSettings'];
  const subscriptions = collections.map(x => Meteor.subscribe(x, slug));
  return {
    session: Sessions.findOne({ slug }),
    token: GlobalSettings.findOne('token'),
    ready: every(subscriptions.map(x => x.ready()), Boolean),
    slug
  };
})(StudentViewComp);
