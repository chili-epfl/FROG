// @flow

import React from 'react';

const Viewer = (props: Object) =>
  <div>
    <h1>A nice Dashboard</h1>
    <p>Data collected:</p>
    {JSON.stringify(props.data)}
  </div>;

const mergeLog = () => {};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
