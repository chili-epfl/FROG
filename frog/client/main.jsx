import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Buffer from 'buffer';

import App from '/imports/client/App';

const theme = createMuiTheme({
  palette: {
    background: {
      default: 'white'
    }
  },
  typography: {
    useNextVariants: true
  }
});

global.Buffer = Buffer.Buffer;
Meteor.startup(() => {
  render(
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>,
    document.getElementById('render-target')
  );
});
