// @flow

import React from 'react';

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';

export const meta = {
  name: 'Text Component',
  type: 'react-component'
};

export const config = {
  type: 'object',
  required: ['title', 'text'],
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    text: {
      type: 'string',
      title: 'Text'
    }
  }
};

export const ActivityRunner = ({ activityData }: ActivityRunnerT) =>
  <div>
    <h1>{activityData.config ? activityData.config.title : 'NO TITLE'}</h1>
    <p>{activityData.config ? activityData.config.text : 'NO TEXT'}</p>
  </div>;
export default ({
  id: 'ac-text',
  ActivityRunner,
  config,
  meta
}: ActivityPackageT);
