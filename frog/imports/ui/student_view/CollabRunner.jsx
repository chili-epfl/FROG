import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { ActivityData, reactiveFn } from '../../api/activity_data';
import { activity_types_obj } from '../../activity_types';
import { createLogger } from '../../api/logs'

// should be separated into its own file
const Runner = ( { session_id, group_id, activity, reactiveKey, reactiveList  }) => {
  const activity_type = activity_types_obj[activity.activity_type]
  const logger = createLogger({
    activity: activity._id, 
    activity_type: activity.activity_type, 
    user: Meteor.userId(),
    group: group_id
  })

  return (
    <div>
      <p>Group id: {group_id}</p>
    <activity_type.ActivityRunner 
      config={activity.data} 
      logger={logger} 
      user={{name: Meteor.user().username, id: Meteor.userId() }}
      reactiveFn = {reactiveFn(1, activity._id, group_id)}
      reactiveData = {{key: reactiveKey[0], list: reactiveList}} /> 
  </div>
  )
}

export default createContainer(({ session_id, group_id, activity, logger }) => {
  return {
    reactiveKey: ActivityData.find({session_id: 1, activity_id: activity._id, group_id: group_id, type: 'kv'}).fetch(),
    reactiveList: ActivityData.find({session_id: 1, activity_id: activity._id, group_id: group_id, type: 'list'}).fetch(),
    activity: activity,
    logger: logger,
    session_id: session_id,
    group_id: group_id
  }
}, Runner)
