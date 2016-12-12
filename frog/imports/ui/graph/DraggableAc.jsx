import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

const divStyleNeg = {
  background: "white",
  border: 2,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "absolute",
  borderStyle: "solid",
  borderColor: "red"

}

const divStyle = {
  background: "white",
  border: 2,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "absolute",
  borderStyle: "solid",
  borderColor: "green"

}
const unitTime = 2

const startOffset = 0

export default class DraggableAc extends Component {

  constructor(props) {
    super(props)

    this.state = {
      correctPlace: false,
      deltaPosition: {x: 0, y: 0},
      controlledPosition: {x: 0, y:0},
      hover: false
    }
  }

  componentDidMount () {
    if(this.props.editorMode) {
      this.setState({deltaPosition: {x: this.props.defaultPosition.x, y:0}})
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
      position: "absolute",
      borderStyle: style.borderStyle,
      borderColor: style.borderColor,
      zIndex: 10

    }
  }

  getCorrectY() {
    return (this.props.plane - 1) * 80 + 10;
  }
  getX() {
    return this.props.startTime  * unitTime + startOffset;
  }

  defaultPosition = () => {
    var { defaultPosition, editorMode } = this.props;
    return {
      x: editorMode ? defaultPosition.x : this.getX(),
      y: this.getCorrectY()
    }
  }

  handleStart = (event) => {

  }

  handleDrag = (event, ui) => {
    event.preventDefault();
    var {x, y} = this.state.deltaPosition;

    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });

  }

  handleStop = (event) => {
    event.preventDefault();
    var delta = this.state.deltaPosition;

    var position = this.checkLayout(delta, event);
    this.props.handleMove(this.props.arrayIndex, position)

    this.setState({
      deltaPosition: position.newDelta,
      correctPlace: position.newPlace,
      controlledPosition: position.newControlledPostition
    });
  }

  /*
  checkPosition = (delta) => {
    var ey = editorPosition.y;
    var newPlace = (delta.y == this.getCorrectY() - ey);

    var newDelta = delta;
    if(!newPlace) {
      newDelta = {x: 0, y: 0};
    }

    var newControlledPostition = {x: editorPosition.x + delta.x, y:ey + delta.y};

    if(!this.props.inGraph) {
      newControlledPostition = this.props.defaultPosition;
    }
    return {
      newPlace: newPlace,
      newDelta: newDelta,
      newControlledPostition: newControlledPostition
    };
  }
  */

  checkLayout = (delta, event) => {
    var newPlace = (delta.y <= 200); //corresponding to height of parent's svg

    var newDelta = {x: delta.x, y: this.getCorrectY()};
    var newY = this.getCorrectY();

    if(!newPlace) {

      newDelta = {x: 0, y: 0};
      newY = 0;

      this.props.delete(this.props.activity)
    }
    var newControlledPostition = {x: delta.x, y:newY};


    return {
      newPlace: newPlace,
      newDelta: newDelta,
      newControlledPostition: newControlledPostition
    };
  }

  positionAndReset = () => {
    return this.state.correctPlace ?
      this.state.controlledPosition
      : this.defaultPosition(this.props.editorMode);
  }

  render() {
    return(
      <Draggable
        axis='both'
        id = {'drag_' + this.props.activity._id}
        defaultPosition={this.defaultPosition()}
        position={this.positionAndReset()}

        disabled={!this.props.editorMode}

        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        grid={[30, 20]}>
          <div
            style={this.AcDivStyle(divStyle)}>

            Plane {this.props.plane}<br/>
            Pos {this.state.controlledPosition.x}<br/>
          </div>

        </Draggable>

    );

  }
}

DraggableAc.propTypes = {
  activity: PropTypes.object.isRequired,
  editorMode: PropTypes.bool.isRequired,
  plane: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  defaultPosition: PropTypes.object.isRequired,
  handleMove: PropTypes.func.isRequired,
  arrayIndex: PropTypes.number.isRequired,
  delete: PropTypes.func
};
