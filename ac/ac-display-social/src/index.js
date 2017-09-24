// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Display social attribute',
  shortDesc: 'Display the social attribute chosen',
  description: '',
  exampleData: [
    {
      title: 'Basic case',
      config: { title: 'Please find your groups' },
      data: {}
    },

    {
      title: 'Basic case with name',
      config: { title: 'Please find your groups', displayName: true },
      data: {}
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    displayName: {
      title: 'Display user name in message?',
      type: 'boolean'
    }
  }
};

// the actual component that the student sees
const ActivityRunner = ({
  activityData: { config },
  groupingValue,
  userInfo: { name }
}) =>
  <div>
    {config.title &&
      <h1>
        {config.title}
      </h1>}
    <h2>
      {config.displayName && `Hi, ${name}. `} You are in group {groupingValue}.
    </h2>
  </div>;

export default ({
  id: 'ac-display-social',
  type: 'react-component',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
