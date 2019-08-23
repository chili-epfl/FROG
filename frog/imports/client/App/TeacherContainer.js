// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { every } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ExternalOperators } from '/imports/api/operators';
import { operatorTypesObj, operatorTypes } from '/imports/operatorTypes';
import { RootSwitcher } from './RootSwitcher';
import SingleActivity from '/imports/client/SingleActivity';
import TeacherView from '../TeacherView';
import GraphEditor from '../GraphEditor';
import Preview from '../Preview';

const TeacherContainer = ({ ready }: { ready: boolean }) => {
  if (!ready) {
    return <CircularProgress />;
  }
  return (
    <div id="app">
      <Switch>
        <Route path="/" exact component={RootSwitcher} />
        <Route path="/wizard" exact component={SingleActivity} />
        <Route path="/t/:slug" component={TeacherView} />
        <Route path="/t" component={TeacherView} />
        <Route path="/teacher/preview/:previewId" component={Preview} />
        <Route path="/teacher/preview" component={Preview} />
        <Route path="/teacher/orchestration/:slug" component={TeacherView} />
        <Route path="/teacher/orchestration" component={TeacherView} />
        <Route path="/teacher/graph/:graphId" component={GraphEditor} />
        <Route path="/teacher/graph" component={GraphEditor} />
        <Route component={GraphEditor} />
      </Switch>
    </div>
  );
};

export default withTracker(() => {
  const collections = [
    'graphs',
    'sessions',
    'globalSettings',
    'externalOperators'
  ];

  const subscriptions = collections.map(x => Meteor.subscribe(x));
  const extOp = ExternalOperators.find({}).fetch();
  extOp.forEach(ext => {
    if (!operatorTypes.includes(ext)) {
      operatorTypes.push(ext);
    }
    operatorTypesObj[ext.id] = ext;
  });

  return { ready: every(subscriptions.map(x => x.ready()), Boolean) };
})(TeacherContainer);
