import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';

const ActivityRunner = ({ activityData, data }: ActivityRunnerPropsT) => {
  let url = activityData.config.url;
  if (data.uuid) {
    url = url && url.replace('{}', data.uuid);
  }
  return (
    <iframe
      title="IFrame"
      src={url}
      allow={
        activityData.config.trusted &&
        'geolocation *; microphone *; camera *; midi *; encrypted-media *;'
      }
      style={{ width: '100%', height: '100%', overflow: 'auto' }}
    />
  );
};

export default ActivityRunner;
