// @flow

import React from 'react';
import { type ActivityPackageT, TextInput, uuid } from 'frog-utils';

const meta = {
  name: 'Common Knowledge board',
  type: 'react-component'
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    }
  }
};

const dataStructure = {};

const mergeFunction = (object, dataFn) => {};

const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) =>
  <div>
    {JSON.stringify(activityData)}
  </div>;

export default ({
  id: 'ac-ck-board',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
