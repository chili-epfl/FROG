import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import Buffer from 'buffer';

import App from '../imports/ui/App';

const theme = createMuiTheme({});

global.Buffer = Buffer.Buffer;

Meteor.startup(() => {
  render(
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>,
    document.getElementById('render-target')
  );
});
