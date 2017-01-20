import React from 'react'
import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data'

import { ActivityData, reactiveFn } from '../../api/activityData'
import { activityTypesObj } from '../../activityTypes'
import { createLogger } from '../../api/logs'

// should be separated into its own file
const Runner = ({ groupId, activity, reactiveKey, reactiveList, data, onCompletion }) => {
  const activityType = activityTypesObj[activity.activityType]
  const logger = createLogger({
    activity: activity._id,
    activityType: activity.activityType,
    user: Meteor.userId(),
    groupId
  })

  return (
    <div>
      <p>Group id: {groupId}</p>
      <activityType.ActivityRunner
        config={activity.data}
        logger={logger}
        user={{ name: Meteor.user().username, id: Meteor.userId() }}
        reactiveFn={reactiveFn(1, activity._id, groupId)}
        reactiveData={{ key: reactiveKey[0], list: reactiveList }}
        onCompletion={onCompletion}
        data={data}
      />
    </div>
  )
}

export default createContainer(({ sessionId, groupId, activity, logger, data }) => {
  const reactiveKey = ActivityData.find({ activityId: activity._id, groupId, type: 'kv' }).fetch()
  const reactiveList = ActivityData.find({ activityId: activity._id, groupId, type: 'list' }).fetch()
  return { reactiveKey, reactiveList, activity, logger, sessionId, groupId, data }
}, Runner)
