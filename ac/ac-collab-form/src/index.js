import React from 'react';
import { Chat } from 'frog-utils';

import ActivityRunner from './form';
import Dashboard from './dashboard';

export const meta = {
  name: 'Simple collab form',
  type: 'react-component',
  mode: 'collab'
};

export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Form title'
    },
    questions: {
      type: 'string',
      title: 'Type in questions, separated by comma'
    }
  }
};

export const ActivityRunnerWrapper = props => (
  <div>
    <div className="col-md-4"><ActivityRunner {...props} /> </div>
    <div className="col-md-4"><Chat {...props} /></div>
  </div>
);

export default {
  id: 'ac-collab-form',
  meta,
  config,
  ActivityRunner: ActivityRunnerWrapper,
  Dashboard
};
