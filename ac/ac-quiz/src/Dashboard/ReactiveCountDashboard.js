/* eslint-disable react/no-array-index-key */

import * as React from 'react';

import { CountChart, type LogDbT, type ActivityDbT } from 'frog-utils';

const Viewer = ({ state }) => (
  <React.Fragment>{JSON.stringify(state)}</React.Fragment>
);

const reactiveToDisplay = (reactive: any, activity: ActivityDbT) => {
  return { text: JSON.stringify(reactive) };
};

export default {
  Viewer,
  reactiveToDisplay,
  initData: {}
};
