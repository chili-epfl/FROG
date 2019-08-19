// @flow

import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { withTracker } from 'meteor/react-meteor-data';
import CircularProgress from '@material-ui/core/CircularProgress';
import { every } from 'lodash';
import { UserStatus } from 'meteor/mizzao:user-status';
import LearnLandingPage from '../App/LearnLanding';

import { Sessions } from '/imports/api/sessions';
import { GlobalSettings, LocalSettings } from '/imports/api/settings';
import SessionBody from './SessionBody';

const once = { already: false };

type StudentViewCompPropsT = {
  token?: { value: string },
  slug: string,
  session: Object,
  ready: boolean
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
    if (this.props.ready && this.props.slug !== 'NO-SESSION') {
      this.checkSessionJoin(this.props.slug);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      (nextProps.slug !== this.props.slug ||
        (!this.props.ready && nextProps.ready)) &&
      nextProps.ready &&
      nextProps.slug !== 'NO-SESSION'
    ) {
      this.checkSessionJoin(nextProps.slug);
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
    if (this.props.slug === 'NO-SESSION') {
      return <h1>Waiting for teacher to select new session</h1>;
    }
    if (this.state.result === 'error') {
      return <LearnLandingPage errorMessage={this.state.message} />;
    }
    if (!this.props.ready) {
      return <CircularProgress />;
    }
    if (!this.props.session) {
      return <CircularProgress />;
    }
    if (this.props.session.state === 'WAITINGFORNEXT') {
      return (
        <div>
          <h1>Waiting for next activity</h1>
          <CircularProgress />
        </div>
      );
    }

    return (
      <React.Fragment>
        <SessionBody token={this.props.token} />
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

  let slug =
    props.match?.params?.slug && props.match.params.slug.trim().toUpperCase();
  let subscriptions = [];

  if (LocalSettings.follow) {
    Meteor.subscribe('follow', LocalSettings.follow);
    const follow = Meteor.users.findOne({ username: LocalSettings.follow });
    if (follow) {
      const session = follow.profile?.controlSession;

      slug = session
        ? Sessions.findOne(follow.profile?.controlSession)?.slug
        : 'NO-SESSION';
      if (slug === 'NO-SESSION') {
        subscriptions.map(x => x.stop());
      }
    }
  }

  if (slug && slug !== 'NO-SESSION') {
    const collections = ['session_activities', 'globalSettings'];
    subscriptions = collections.map(x => Meteor.subscribe(x, slug));
  }

  return {
    session: Sessions.findOne({ slug }),
    token: GlobalSettings.findOne('token'),
    ready: every(subscriptions.map(x => x.ready()), Boolean) && slug,
    slug
  };
})(StudentViewComp);
