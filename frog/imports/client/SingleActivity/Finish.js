// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import ArrowBack from '@material-ui/icons/ArrowBack';
import Typography from '@material-ui/core/Typography';
import { LocalSettings } from '/imports/api/settings';
import { type PropsT } from './types';
import { style } from './style';

const BASE_URL = window.location.origin;

/**
 * The final screen displayed after the creation of a single activity.
 * @param {Object} url - An object containing the paths of public and dashboard view
 * @param {Function} onReturn - Callback function for handling the 'Back' button
 */
function Finish(
  props: {
    url: {
      public: string,
      dashboard: string
    },
    onReturn: Function
  } & PropsT
) {
  const { url, classes } = props;

  LocalSettings.UrlCoda = '?u=' + Meteor.userId();
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
        {BASE_URL + '/' + url.public}
      </Typography>
      <Typography variant="h4" component="h3" className={classes.padded_text}>
        Here's a secret link to your behind-the-scene view of the dashboard:{' '}
        <Link to={'/' + url.dashboard + '?u=' + Meteor.userId()}>
          {BASE_URL + '/' + url.dashboard + '?u=' + Meteor.userId()}
        </Link>
      </Typography>
    </Card>
  );
}
export default withStyles(style)(Finish);
