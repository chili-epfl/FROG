// @flow

import React from 'react';

export default ({
  activities,
  session
}: { activities: Array<Object>, session: Object }) => (
  <div>
    <h3>Available Activities</h3>
    {activities && activities.length
      ? <ul>
          {activities.map(activity => (
            <li
              key={activity._id}
              id={
                activity._id === session.activityId &&
                  'run_' + activity.activityType
              }
            >
              {activity.title} - <i>{activity.activityType}</i>
              {activity._id === session.activityId ? ' (running)' : ''}
            </li>
          ))}
        </ul>
      : <p>NO ACTIVITY</p>}
  </div>
);
