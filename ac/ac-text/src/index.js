// @flow

import React from 'react';

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';

export const meta = {
  name: 'HTML text component',
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
    },
    showProducts: {
      type: 'boolean',
      title: 'Show products?'
    }
  }
};

export const ActivityRunner = ({ configData, object }: ActivityRunnerT) => (
  <div>
    <h1>{configData.title}</h1>
    <p>{configData.text}</p>
    {configData.showProducts
      ? <pre>{JSON.stringify(object.products, null, 2)}</pre>
      : null}
  </div>
);
export default ({
  id: 'ac-text',
  ActivityRunner,
  config,
  meta
}: ActivityPackageT);
