// @flow

import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import GraphMenu from './GraphMenu';
import { UndoButton, HelpButton, ConfigMenu } from './Settings';
import ExpandButton from '../SidePanel/ExpandButton';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row'
  }
};

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
