import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { teal, blueGrey } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import Buffer from 'buffer';
import * as Sentry from '@sentry/browser';
import App from '/imports/client/App';

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
Meteor.startup(() => {
  render(
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </MuiThemeProvider>,
    document.getElementById('render-target')
  );
});
