// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';

import GraphMenu from './GraphMenu';
import { UndoButton, HelpButton, ConfigMenu } from './Settings';
import ExpandButton from '../SidePanel/ExpandButton';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: theme.spacing(0.5)
  }
});

const TopPanel = ({ classes, ...props }: Object) => (
  <div className={classes.root}>
    <ConfigMenu {...props} />
    <GraphMenu />
    <HelpButton />
    <UndoButton />
    <ExpandButton />
  </div>
);

export default withStyles(styles)(TopPanel);
