import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

const divStyle = {
  background: "red",
  border: 1,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left"

}

export default class DraggableAc extends Component {

  AcDivStyle(style) {
    return {
      background: style.background,
      border: style.border,
      width: this.props.duration * 40,
      height: style.height,
      margin: style.margin,
      padding: style.padding,
      float: style.float

    }
  }

  constructor(props) {
    super(props);
  }

  getY() {
    return (this.props.plane - 1) * 80 + 50;
  }
  getX() {
    return this.props.startTime * 10;
  }

  handleStart() {}

  handleDrag() {}

  handleStop() {}

  render() {
    return(
      <Draggable
        axis='x'
        defaultPosition={{
          x: this.getX(),
          y: this.getY()
        }}
        disabled={!this.props.interaction}
        onStart={this.handleStart()}
        onDrag={this.handleDrag()}
        onStop={this.handleStop()}
        grid={[25, 25]}>
          <div style={this.AcDivStyle(divStyle)}>

            This is an activity of plane {this.props.plane}
          </div>
        </Draggable>

    );

  }
}

DraggableAc.propTypes = {
  interaction: PropTypes.bool.isRequired,
  plane: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
};
