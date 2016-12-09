import React from 'react';
import { Meteor } from 'meteor/meteor';

import { createLogger } from '../../api/logs';
import { Sessions } from '../../api/sessions';
import { Activities, Results } from '../../api/activities';
import { ActivityData, reactiveData } from '../../api/activity_data';
import { Products, addProduct } from '../../api/products';

import CollabRunner from './CollabRunner.jsx';

import { activity_types_obj } from '../../activity_types';

import {TimedComponent} from 'frog-utils'

const Runner = ( { activity } ) => {
  const activity_type = activity_types_obj[activity.activity_type]
  const onCompletion = (data) => addProduct(activity._id, activity.activity_type, Meteor.userId(), data)
  const input_raw = Results.findOne({activity_id: activity._id, type: 'product'})
  const data = input_raw && input_raw.result

  const social = Results.findOne({activity_id: activity._id, type: 'social'})

  // if no social operator, assign entire class to group 0
  const group_id = social ? objectIndex(social.result)[Meteor.userId()] : 0

  if(activity_type.meta.mode == 'collab') { 
    return <CollabRunner 
      activity={activity} 
      session_id={1} 
      group_id={group_id}
      onCompletion={onCompletion}
      data={data}/>
  } else {
    const logger = createLogger({
      activity: activity._id, 
      activity_type: activity.activity_type, 
      user: Meteor.userId()
    })
    const onCompletion = (data) => addProduct(activity._id, activity.activity_type, Meteor.userId(), data)
    return <activity_type.ActivityRunner 
      config={activity.data} 
      logger={logger}
      onCompletion={onCompletion}
      data={data} />
  }
}

var TimedRunner = ( { activity, timeNow } ) => {
  const duration = activity.data.duration

  var createdAt = Sessions.findOne({activity: activity._id}).startedAt
  // This will give a number with one digit after the decimal dot (xx.x):
  var seconds = (duration - ((timeNow - createdAt) / 1000)).toFixed(1);

  return ( duration == 0 ? <Runner activity={activity}/> : 
          ( seconds < 0 ? <h1>Time-out for this activity</h1> :
            <div>
              <p>This activity will end in <b>{seconds} seconds</b>.</p>
              <Runner activity={activity}/>
            </div>
          )
        );
}

export default TimedComponent(TimedRunner, 50)