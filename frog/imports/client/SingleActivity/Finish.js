// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { type PropsT } from './types';

/**
 * The final screen displayed after the creation of a single activity.
 * @param {Object} url - An object containing the paths of public and dashboard view
 * @param {Function} onReturn - Callback function for handling the 'Back' button
 */
export default function Finish(
  props: {
    url: {
      public: String,
      dashboard: String
    },
    onReturn: Function
  } & PropsT
) {
  const { url, classes } = props;
  return (
    <Card raised className={classes.card}>
      <IconButton
        onClick={() => props.onReturn()}
        className={classes.back_button}
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h3" component="h2" className={classes.padded_text}>
        You're all set, please share this link with the participants:{' '}
        <a
          href={
            window.location.protocol +
            '//' +
            window.location.hostname +
            ':' +
            window.location.port +
            '/' +
            url.public
          }
        >
          {window.location.protocol +
            '//' +
            window.location.hostname +
            ':' +
            window.location.port +
            '/' +
            url.public}
        </a>
      </Typography>
      <Typography variant="h4" component="h3" className={classes.padded_text}>
        Here's a secret link to your behind-the-scene view of the dashboard:{' '}
        <a
          href={
            window.location.protocol +
            '//' +
            window.location.hostname +
            ':' +
            window.location.port +
            '/' +
            url.dashboard
          }
        >
          {window.location.protocol +
            '//' +
            window.location.hostname +
            ':' +
            window.location.port +
            '/' +
            url.dashboard}
        </a>
      </Typography>
    </Card>
  );
}
