// @flow

import * as React from 'react';
import { type ActivityPackageT } from 'frog-utils';
import { uniq } from 'lodash';

const meta = {
  name: 'Display social attribute',
  shortName: 'Display social',
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
    },
    displayGroup: {
      title: 'Display the names of all the students in the group?',
      type: 'boolean'
    }
  }
};

// the actual component that the student sees
const ActivityRunner = props => {
  const {
    activityData,
    groupingValue,
    userInfo: { name },
    dataFn,
    data
  } = props;
  const configData = activityData.config;
  if (!data.includes(name)) {
    dataFn.listAppend(name);
  }

  const others = uniq(data).filter(x => x !== name);
  const hasOthers = others.length > 0;
  return (
    <div>
      {configData.title && <h1>{configData.title}</h1>}
      <h2>
        {configData.displayName && `Hi, ${name}. `} You are{' '}
        {!hasOthers && 'alone '}in group {groupingValue}.
      </h2>
      {configData.displayGroup &&
        hasOthers && (
          <h3>
            {'The other group members are: ' +
              uniq(data)
                .filter(x => x !== name)
                .sort()
                .join(', ')}
          </h3>
        )}
    </div>
  );
};

const dataStructure = [];

export default ({
  id: 'ac-display-social',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  dataStructure
}: ActivityPackageT);
