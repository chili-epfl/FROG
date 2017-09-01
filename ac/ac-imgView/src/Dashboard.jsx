// @flow

import React from 'react';
import { CountChart } from 'frog-utils';

const Viewer = (props: Object) => <CountChart {...props} />

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
