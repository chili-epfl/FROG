// @flow

import React from 'react';
import { CountChart } from 'frog-utils';

const Viewer = ({ data }: Object) =>
  <pre>
    {JSON.stringify(data, null, 2)}
  </pre>;

const mergeLog = (
  data: any,
  dataFn: Object,
  { instanceId, payload }: { instanceId: string, payload: any }
) => {
  console.log('mergeLog');
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
