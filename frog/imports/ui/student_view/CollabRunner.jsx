import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { ActivityData, reactiveFn } from '../../api/activity_data';
import { activity_types_obj } from '../../activity_types';

// should be separated into its own file
const Runner = ( { activity, logger, reactiveData, session_id, group_id } ) => {
  const activity_type = activity_types_obj[activity.activity_type]

  return (
    <activity_type.ActivityRunner 
      config={activity.data} 
      logger={logger} 
      reactiveFn = {reactiveFn(1, activity._id, group_id)}
      reactiveData = {reactiveData[0]} /> 
  )
}

export default createContainer(({ session_id, group_id, activity, logger }) => {
  return {
    reactiveData: ActivityData.find({session_id: 1, activity_id: activity._id, group_id: group_id, type: 'kv'}).fetch(),
    activity: activity,
    logger: logger,
    session_id: session_id,
    group_id: group_id
  }
}, Runner)
