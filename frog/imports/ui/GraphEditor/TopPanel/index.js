// @flow

import React from 'react';

import GraphList from './GraphList';
import GraphConfigPanel from './GraphConfigPanel';
import Settings from './Settings';

export default () => (
  <div id="topPanel">
    <GraphList />
    <GraphConfigPanel />
    <Settings />
  </div>
);
