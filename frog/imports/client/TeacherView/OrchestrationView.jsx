// @flow

import * as React from 'react';
import { withVisibility } from '/imports/frog-utils';
import { compose, withState } from 'recompose';

import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';

import GraphView from './GraphView';
import DashboardNav from '../Dashboard/DashboardNav';
import SessionUtils from './SessionUtils';
import OrchestrationCtrlButtons from './OrchestrationCtrlButtons';
import SettingsModal from './SettingsModal';
import { teacherLogger } from '/imports/api/logs';
import { LocalSettings } from '/imports/api/settings';
import OrchestrationContainer from './Components/OrchestrationContainer';

const styles = {
  root: {
    marginTop: '48px'
  },
  subroot: {
    height: 'calc(100vh - 106px)',
    padding: '10px 0'
  },
  buttonsToBottom: {
    alignSelf: 'flex-end'
  },
  maybeScaled: LocalSettings.scaled
    ? {
        zoom: LocalSettings.scaled + '%'
      }
    : {}
};

class OrchestrationViewController extends React.Component<any, {}> {
  componentDidMount() {
    if (this.props.session) {
      teacherLogger(this.props.session._id, 'teacher.enteredOrchestrationView');
    }
  }

  componentWillUnmount() {
    if (this.props.session) {
      teacherLogger(this.props.session._id, 'teacher.leftOrchestrationView');
    }
  }

  render() {
    const {
      session,
      token,
      visible,
      toggleVisibility,
      settingsOpen,
      setSettingsOpen,
      classes,
      activities
    } = this.props;
    return (
      <OrchestrationContainer
        activities={activities}
        session={session}
      />
    );
  }
}

const OrchestrationView = compose(
  withVisibility,
  withState('settingsOpen', 'setSettingsOpen', false),
  withStyles(styles)
)(OrchestrationViewController);

OrchestrationView.displayName = 'OrchestrationView';
export default OrchestrationView;
