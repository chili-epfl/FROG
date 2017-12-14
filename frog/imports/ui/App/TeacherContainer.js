// @flow
import React from 'react';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import {every} from 'lodash';
import {Route, Switch} from 'react-router-dom';
import Spinner from 'react-spinner';

import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Preview from './../Preview';
import Admin from './../Admin';
import TopBar from './TopBar';

const styles = {
    gridContent: {
        marginLeft: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    subroot: {
        paddingTop: 48,
        paddingRight: 3,
        paddingLeft: 3
    }
};
const TeacherContainer = ({ready}: { ready: boolean }) => {
    if (!ready) {
        return <Spinner/>;
    }
    return (
        <div id="app">
            <Switch>
                <Route path="/preview/:activityTypeId/:example" component={Preview}/>
                <Route path="/preview/:activityTypeId" component={Preview}/>
                <Route path="/graph/:graphId" component={GraphEditor}/>
                <Route path="/graph" component={GraphEditor}/>
                <Route component={WithTopBar}/>
            </Switch>
        </div>
    );
};

const WithTopBar = () => {
    return (
        <div id="subroot" style={styles.subroot}>
            <TopBar barHeight={styles.subroot.paddingTop}/>
            <div id="gc" style={styles.gridContent}>
                <Switch>
                    <Route path="/teacher/:graphId" component={TeacherView}/>
                    <Route path="/teacher" component={TeacherView}/>
                    <Route path="/student" component={StudentView}/>
                    <Route path="/admin" component={Admin}/>
                    <Route path="/preview" component={Preview}/>
                    <Route component={GraphEditor}/>
                </Switch>
            </div>
        </div>
    );
};

export default createContainer(() => {
    const collections = [
        'activities',
        'activity_data',
        'connections',
        'graphs',
        'objects',
        'operators',
        'products',
        'sessions',
        'users'
    ];
    const subscriptions = collections.map(x => Meteor.subscribe(x));
    return {ready: every(subscriptions.map(x => x.ready()), Boolean)};
}, TeacherContainer);
