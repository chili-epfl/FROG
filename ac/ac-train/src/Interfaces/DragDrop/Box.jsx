import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { compose } from 'recompose';

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

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const boxTypes = ({ type }) => type;

class BoxController extends Component {
  render() {
    const { name, connectDragSource, classes } = this.props;

    return connectDragSource(<div className={classes.button}>{name}</div>);
  }
}

const Box = compose(
  DragSource(boxTypes, boxSource, collect),
  withStyles(styles)
)(BoxController);

export default Box;
