// @flow

import React from 'react';

const Viewer = (props: Object) =>
  <pre>
    {JSON.stringify(props, null, 2)}
  </pre>;

const mergeLog = (data: any, dataFn: any, log: any) => {
  dataFn.numIncr(1, log);
};

const initData = {
  vote: 0,
  upload: 0
};

export default {
  Viewer,
  mergeLog,
  initData
};
