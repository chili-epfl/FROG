// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    textAlign: 'center',
    padding: theme.spacing(2)
  }
}));

type WelcomeViewPropsT = {
  slug: string
};

export const WelcomeView = (props: WelcomeViewPropsT) => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <Typography variant="h5">Students can access this session at:</Typography>
      <Typography variant="h2">{props.slug}</Typography>
    </div>
  );
};

export const ConcludedView = () => {
  const classes = useStyle();

  return (
    <div className={classes.root}>
      <Typography variant="h5">
        Session is completed. You can access dashboards by clicking on the
        activity steps on the left.
      </Typography>
    </div>
  );
};
