// @flow
import React, { Component } from 'react';

import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { DropTarget } from 'react-dnd';
import { capitalizeFirstLetter } from '../../ActivityUtils';

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    height: '100px'
  })
});

const dustbinTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

type PropsT = {
  title: string,
  isOver?: Function,
  canDrop?: Function,
  connectDropTarget: Function,
  lastDroppedItem: string,
  classes: Object
};

@withStyles(styles)
@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class DropElements extends Component<PropsT> {
  render() {
    const {
      title,
      isOver,
      canDrop,
      connectDropTarget,
      lastDroppedItem,
      classes
    } = this.props;
    const isActive = isOver && canDrop;

    return connectDropTarget(
      <div>
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="title" align="center" component="h3">
            {capitalizeFirstLetter(title)}
          </Typography>
          {isActive && 'Release to drop'}
          {lastDroppedItem}
        </Paper>
      </div>
    );
  }
}
