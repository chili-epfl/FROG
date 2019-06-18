// @flow

import React from 'react';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { LearningItem } from './index';

type DisplayPropsT = {
  slug: string,
  classes: Object
};

const style = {
  card: {
    minWidth: 275,
    maxWidth: 900,
    margin: 'auto',
    marginTop: 16,
    marginBottom: 16,
    padding: 16
  },
  navbar: {
    flexDirection: 'row-reverse'
  },
  logo: {
    position: 'absolute',
    left: 16
  }
};

const Display = (props: DisplayPropsT) => {
  const { classes } = props;
  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar classes={{ root: classes.navbar }}>
          <Typography variant="h6" color="inherit" className={classes.logo}>
            FROG
          </Typography>
          <Button size="medium">Help</Button>
          <Button size="medium">Log In/Sign Up</Button>
        </Toolbar>
      </AppBar>
      <Card raised className={classes.card}>
        <LearningItem type="view" id={props.slug} />
      </Card>
    </>
  );
};
export default withStyles(style)(Display);
