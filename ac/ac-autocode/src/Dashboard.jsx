// @flow

import React from 'react';

import { type LogDBT } from 'frog-utils';

const Viewer = (props: Object) => (
  <div>
    <h1>A nice Dashboard</h1>
    <p>Data collected:</p>
    <pre>{JSON.stringify(props.data, null, 2)}</pre>
  </div>
);

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.itemId !== undefined && ['SUCCESS', 'FAILURE'].includes(log.type)) {
    const message = log.userId + '_' + log.itemId + '_' + log.type;
    dataFn.listAppend(message, 'logs');
  }
};

const initData = { logs: [] };

export default {
  Viewer,
  mergeLog,
  initData
};
