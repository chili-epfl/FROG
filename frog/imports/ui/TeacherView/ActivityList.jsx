// @flow

import React from 'react';

export default ({ activities }: { activities: Array<Object> }) =>
  <div style={{ display: 'flex' }}>
    <div>
      <h3>Available Activities</h3>
    </div>
    <div
      style={{
        marginLeft: '50px',
        alignSelf: 'center',
        justifyContent: 'center'
      }}
    >
      {activities && activities.length
        ? <ul>
            {activities.map(activity =>
              <li key={activity._id}>
                {activity.title} - <i>{activity.activityType}</i>
              </li>
            )}
          </ul>
        : <p>NO ACTIVITY</p>}
    </div>
  </div>;
