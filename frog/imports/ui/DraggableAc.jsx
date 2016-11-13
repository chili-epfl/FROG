import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor'
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

const divStyleNeg = {
  background: "red",
  border: 1,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "absolute"

}

const divStyle = {
  background: "green",
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

  constructor(props) {
    super(props)

    this.state = {
      correctPlace: false,
      deltaPosition: {x: 0, y: 0},
      controlledPosition: {x: 0, y:0}
    }
  }

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

  getY() {
    return (this.props.plane - 1) * 80 + 10;
  }
  getX() {
    return this.props.startTime  * unitTime + startOffset;
  }

  handleStart = (event) => {

  }

  handleDrag = (event, ui) => {
    event.preventDefault();
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });

  }

  handleStop = (event) => {
    event.preventDefault();
    const {x, y} = this.state.deltaPosition;
    this.setState({
      controlledPosition: {
        x: this.getX() + x,
        y: this.getY() + y,
      }
    });

    var newPlace = false;
    if(this.getY() + y == this.getY()) {
      newPlace = true;
    }

    this.setState({correctPlace: newPlace});
  }

  render() {
    return(
      <Draggable
        axis='both'

        defaultPosition={{
          x: this.getX(),
          y: this.getY()
        }}
        disabled={!this.props.editorMode}
        bounds={{left: startOffset}}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        grid={[30, 30]}>
          <div style={
            this.state.correctPlace ? this.AcDivStyle(divStyle)
              : this.AcDivStyle(divStyleNeg)
          }>

            This is an activity of plane {this.props.plane}
            {this.state.controlledPosition.y}
          </div>
        </Draggable>

    );

  }
}

DraggableAc.propTypes = {
  editorMode: PropTypes.bool.isRequired,
  plane: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired
};
