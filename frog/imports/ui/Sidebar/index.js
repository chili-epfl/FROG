// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';
import { Panel } from './Panel';

const useStyle = makeStyles(theme => ({
  root: {
    width: '250px',
    height: '100%',
    background: grey[100],

    display: 'flex',
    flexFlow: 'column nowrap'
  },
  actionBar: {
    marginTop: 'auto',
    background: grey[200],
    width: '100%',
    height: '48px'
  }
}));

export const Sidebar = () => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <Panel title="Activities" />
      <Panel title="Students" />
      <div className={classes.actionBar}></div>
    </div>
  );
};
