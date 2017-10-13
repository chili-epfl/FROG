// @flow

import React from 'react';

const Viewer = (props: Object) =>
  <div>
    <h1>A nice Dashboard</h1>
    {JSON.stringify(props)}
  </div>;

const mergeLog = () => {};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
