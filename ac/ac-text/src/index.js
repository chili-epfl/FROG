// @flow

import React from 'react';

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';

export const meta = {
  name: 'Text Component',
  type: 'react-component'
};

export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    text: {
      type: 'string',
      title: 'Text (HTML)'
    }
  }
};

export const ActivityRunner = ({ configData, data }: ActivityRunnerT) => {
  console.log(configData)
  return(
    <div>
      <h1>{data.config ? data.config.title : 'NO TITLE'}</h1>
      <p>{data.config ? data.config.text : 'NO TEXT'}</p>
    </div>
  )
}
export default ({
  id: 'ac-text',
  ActivityRunner,
  config,
  meta
}: ActivityPackageT);
