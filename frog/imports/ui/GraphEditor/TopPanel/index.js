// @flow

import React from 'react';

import GraphList from './GraphList';
import GraphConfigPanel from './GraphConfigPanel';
import { UndoButton, ConfigMenu } from './Settings';

export default () => (
  <div id="topPanel" className="bootstrap">
    <div>
      <ConfigMenu />
      <GraphList />
    </div>
    <GraphConfigPanel />
    <UndoButton />
  </div>
);
