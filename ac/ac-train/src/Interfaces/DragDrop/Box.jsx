import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  button: {
    cursor: 'move',
    border: '1px dashed gray',
    backgroundColor: 'white',
    textAlign: 'center',
    padding: '10px'
  }
});

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  }
};

@withStyles(styles)
@DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Box extends Component {
  render() {
    const {
      name,
      isDropped,
      isDragging,
      connectDragSource,
      classes
    } = this.props;

    const opacity = isDragging ? 0.4 : 1;

    return connectDragSource(<div className={classes.button}>{name}</div>);
  }
}
