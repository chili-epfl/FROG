// @flow

import React from 'react';

const Viewer = (props : Object) => (
  <div>
    <h1>A nice Dashboard</h1>
    {JSON.stringify(props)}
  </div>
);

const mergeLog = (data : any, dataFn : any, log : any) => {};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
