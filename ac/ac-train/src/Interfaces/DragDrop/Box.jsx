import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { withStyles } from 'material-ui/styles';

const styles = {
  button: {
    cursor: 'move',
    border: '1px dashed gray',
    backgroundColor: 'white',
    textAlign: 'center',
    padding: '10px'
  }
};

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name
    };
  }
};

class BoxController extends Component {
  render() {
    const { name, connectDragSource, classes } = this.props;

    return connectDragSource(<div className={classes.button}>{name}</div>);
  }
}

const Box = DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))(withStyles(styles)(BoxController));

export default Box;
