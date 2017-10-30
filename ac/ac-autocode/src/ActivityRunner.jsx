// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

const ActivityRunner = ({ activityData }: ActivityRunnerT) => {
  const submitCode = () => {};

  return (
    <div>
      <h1>{activityData.config.title || 'Coding exercise'}</h1>
      <div>
        <p>
          {activityData.config.guidelines || 'Instructions for the exercise'}
        </p>
        <textarea
          name="codeArea"
          rows="20"
          cols="80"
          defaultValue="Your code here"
        />
      </div>
      <button type="button" onClick={submitCode}>
        Submit
      </button>
    </div>
  );
};

export default ActivityRunner;
