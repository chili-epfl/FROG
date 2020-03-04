import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import Buffer from 'buffer';
import * as Sentry from '@sentry/browser';
import App from '/imports/client/App';

console.log('main.jsx 1');

Sentry.init({
  dsn: 'https://59d972c46140436a8bd7094bd6e3eb82@sentry.io/214223',
  release: Meteor.gitCommitHash,
  environment: process.env.NODE_ENV,
  beforeSend(event, hint) {
    const error = hint.originalException;
    if (error?.message && error.message.match(/Userid reset successfully/i)) {
      return null;
    }
    return event;
  }
});

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#26B7C6',
      main: '#22A6B3',
      dark: '#1D8C97'
    },
    secondary: blueGrey,
    background: {
      default: '#fff'
    }
  },
  typography: {
    useNextVariants: true
  }
});

global.Buffer = Buffer.Buffer;

console.log('main.jsx 2');

Meteor.startup(() => {
  console.log('main.jsx 3');

  render(
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>,
    document.getElementById('render-target')
  );

  console.log('main.jsx 4');
});
