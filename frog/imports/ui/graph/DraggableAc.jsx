import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

const computeTopPosition = (object) => {
  let inner = $("#inner_graph").offset().top
  let elem = $(object).offset().top
  return elem - inner
}

const unitTime = 2

const divStyle = (duration) => {
  return {
    background: "white",
    textAlign:"center",
    border: 2,
    width: duration * unitTime,
    height: 40,
    margin: 10,
    padding: 10,
    float: "left",
    position: "absolute",
    borderStyle: "solid",
    borderColor: "green"
  }
}

export default class DraggableAc extends Component {

  constructor(props) {
    super(props)

    this.setState = {
      remove: false,
      deltaPosition: {x: 0, y: 0},
      controlledPosition: {x: 0, y:0},
      hover: false
    }
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

  render() {
    return(
      <Draggable
        axis='x'
        id = {'drag_' + this.props.activity._id}
        defaultPosition={this.defaultPosition()}
        position={this.positionAndReset()}

        disabled={!this.props.editorMode}

        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        grid={[30, 20]}
        cancel="svg">
        <div  style={{position: 'relative', zIndex: 1}}>
          <div id = {this.props.activity._id}  style={divStyle(this.props.duration)}>
            <svg height="10" width="10" style={{position: "relative"}} onClick={(event) => this.props.targetOperator(this.props.activity)}>
              <circle cx="5" cy="5" r="5" stroke="black" fill="white" id={"target" + this.props.activity._id}/>
            </svg>
            <span>  Plane {this.props.plane}  </span>
            <svg height="10" width="10" style={{position: "relative"}} onClick={(event) => this.props.sourceOperator(this.props.activity)}>
              <circle cx="5" cy="5" r="5" stroke="black" fill={this.props.isSourceClicked ? "red" : "white"} id={"source" + this.props.activity._id} />
            </svg>
          </div>
        </div>
        </Draggable>

    );

  }
}

DraggableAc.propTypes = {
  activity: PropTypes.object.isRequired,
  plane: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  handleMove: PropTypes.func.isRequired,
  arrayIndex: PropTypes.number.isRequired,
  delete: PropTypes.func,
  sourceOperator: PropTypes.func,
  targetOperator: PropTypes.func,
  isSourceClicked: PropTypes.bool,
};
