import React, { Component } from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
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

@withStyles(styles)
@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))
export default class DropElements extends Component {
  render() {
    const {
      accepts,
      title,
      isOver,
      canDrop,
      connectDropTarget,
      lastDroppedItem,
      classes
    } = this.props;
    const isActive = isOver && canDrop;

    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }

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
