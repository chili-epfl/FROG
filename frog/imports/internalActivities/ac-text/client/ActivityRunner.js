import * as React from 'react';
import { type ActivityRunnerPropsT, HTML } from '/imports//imports/frog-utils';

export const ActivityRunner = ({ activityData }: ActivityRunnerPropsT) => (
  <div style={{ padding: '10px' }}>
    <h1>
      {activityData.config ? activityData.config.general.title.title : ''}
    </h1>
    <span style={{ fontSize: '20px' }}>
      {activityData.config ? (
        <HTML html={activityData.config.general.title.text} />
      ) : (
        ''
      )}
    </span>
  </div>
);

export default ActivityRunner;
