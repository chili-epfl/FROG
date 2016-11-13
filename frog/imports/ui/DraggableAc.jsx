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
  float: "left",
  position: "absolute"

}

const unitTime = 2

const startOffset = 70

export default class DraggableAc extends Component {

  AcDivStyle(style) {
    return {
      background: style.background,
      border: style.border,
      width: this.props.duration * unitTime,
      height: style.height,
      margin: style.margin,
      padding: style.padding,
      float: style.float,
      position: style.position

    }
  }

  constructor(props) {
    super(props);
  }

  getY() {
    return (this.props.plane - 1) * 80 + 10;
  }
  getX() {
    return this.props.startTime  * unitTime + startOffset;
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
        bounds={{left: startOffset}}
        onStart={this.handleStart()}
        onDrag={this.handleDrag()}
        onStop={this.handleStop()}
        grid={[30, 30]}>
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
