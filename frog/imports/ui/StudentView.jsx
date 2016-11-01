import React, { Component } from 'react';
import { Act, Log, AppState } from '../api/act'
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { uuid } from 'frog-utils'
import { sortBy, reverse, take, find } from 'lodash'
import { objectize } from '../../lib/utils'

import Activities from '../activities'

const getActivity = (id) => Activities.filter(x => x.meta.id == id)[0]
const getSpecificActivity = (activities, id) => 
   activities.filter(x => x._id == id)[0]

const RunActivity = ( { activity } ) => {
  const runActivity = getActivity(activity.activity_type)
  return(<runActivity.activity config = { activity.data } logger={createLogger({activity: activity._id, user: Meteor.userId()}) }/>)
}

const createLogger = (merge) => { 
  const logger = (x) => {
    const logentry = {...merge, _id: uuid(), created_at: Date(), message: x}
    Log.insert(logentry)
  }
  return logger
}

const ActivityBody = ({appstate, activities}) => 
  appstate.currentActivity ? <RunActivity activity={getSpecificActivity(activities, appstate.currentActivity)} /> : <h1>Pause</h1>

export default createContainer(() => {
  return {
    activities: Act.find({}).fetch(),
    appstate: objectize(AppState.find({}).fetch())
  }
}, ActivityBody)
