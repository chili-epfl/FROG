import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { activity_types_obj } from '../activity_types'
import { createLogger } from '../api/log'
import { objectize} from '../../lib/utils'
import { AppState } from '../api/appstate'

const RunActivity = ( { activity } ) => {
  const activity_type = activity_types_obj[activity.activity_type]
  console.log(activity_type)
  const logger = createLogger({
    activity: activity._id, 
    activity_type: activity.activity_type, 
    user: Meteor.userId()})

  return(<activity_type.ActivityRunner 
    config = {activity.data} 
    logger = { logger } />)
}

// either show the current activity, or Pause
const ActivityBody = ( { currentActivity } ) => 
  currentActivity && currentActivity._id ? 
    <RunActivity activity={currentActivity} /> : 
    <h1>Pause</h1>

export default createContainer(() => ({
    currentActivity: objectize(AppState.find({}).fetch()).currentActivity
  }) , ActivityBody)
