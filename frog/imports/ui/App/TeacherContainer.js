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
import TopBar, {BasicTabs} from './TopBar';

const styles = {
    uber: {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Roboto'
    },  navbar: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
    }
};
const TeacherContainer = ({ready}: { ready: boolean }) => {
    if (!ready) {
        return <Spinner/>;
    }
    return (
            <div id="app" style={styles.uber}>
                <BasicTabs/>
                <Switch>


                </Switch>
            </div>
    );
};

const WithTopBar = () => (
    <div>
        <Switch>

            <Route component={GraphEditor}/>
        </Switch>
    </div>
);

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
