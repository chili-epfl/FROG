// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

const ActivityRunner = ({
  // commenting other available varaibles
  /* userInfo,
  logger,
  data,
  dataFn */
  activityData
}: ActivityRunnerT) =>
  <div>
    <h1>
      {activityData.config.title || 'Coding exercise'}
    </h1>
    <div>
      <p>
        {activityData.config.guidelines || 'Instructions for the exercise'}
      </p>
      <textarea name="textarea" rows="20" cols="80">
        Write your code here
      </textarea>
    </div>
    <button type="button">Submit</button>
  </div>;

export default ActivityRunner;
