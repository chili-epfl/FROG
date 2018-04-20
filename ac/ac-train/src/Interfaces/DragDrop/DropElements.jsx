// @flow
import React, { Component } from 'react';

import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import { DropTarget } from 'react-dnd';
import { compose } from 'recompose';
import { capitalizeFirstLetter } from '../../ActivityUtils';

const styles = theme => ({
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    height: '100px'
  })
});

const dropElementsTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  }
};

const collect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
});

const acceptedItems = ({ accepts }) => accepts;

type PropsT = {
  title: string,
  isOver?: Function,
  canDrop?: Function,
  connectDropTarget: Function,
  lastDroppedItem: string,
  classes: Object
};

class DropElementsController extends Component<PropsT> {
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

const DropElements = compose(
  DropTarget(acceptedItems, dropElementsTarget, collect),
  withStyles(styles)
)(DropElementsController);

export default DropElements;
