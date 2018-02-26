import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import Buffer from 'buffer';

import App from '../imports/ui/App';

global.Buffer = Buffer.Buffer;

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
});
