// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

export const meta = {
  name: 'Embedded website',
  type: 'react-component',
  shortDesc: 'reading a website',
  description: 'Display a frame containing a website'
};

export const config = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: 'URL of website'
    }
  }
};

export const ActivityRunner = ({ activityData }: ActivityRunnerT) =>
  <iframe
    title="IFrame"
    src={activityData.config.url}
    style={{ width: '100%', height: '100%', overflow: 'auto' }}
  />;

export default {
  id: 'ac-iframe',
  ActivityRunner,
  config,
  meta
};
