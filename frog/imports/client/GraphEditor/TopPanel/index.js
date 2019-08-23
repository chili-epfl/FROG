// @flow

import React from 'react';
import { withStyles } from '@material-ui/styles';
import { UndoButton, ConfigMenu } from './Settings';
import { ValidButton } from '/imports/client/GraphEditor/Validator';
import { Button } from '/imports/ui/Button';

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
    <UndoButton />
    <Button rightIcon={<ValidButton />}> Publish </Button>
    <ConfigMenu {...props} />
  </div>
);

export default withStyles(styles)(TopPanel);
