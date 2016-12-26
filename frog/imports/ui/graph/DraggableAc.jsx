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

const boxHeight = 40

const divStyle = (duration) => {
  return {
    background: "white",
    textAlign:"center",
    border: 2,
    width: duration * unitTime,
    height: boxHeight,
    margin: 10,
    padding: 10,
    float: "left",
    position: "absolute",
    borderStyle: "solid",
    borderColor: "green"
  }
}

const Anchor = ({id, fill, onClick}) => {
  return (
    <svg height="10" width="10" style={{position: "relative"}} onClick={onClick}>
      <circle cx="5" cy="5" r="5" stroke="black" fill={fill} id={id}/>
    </svg>
  )
}

export default class DraggableAc extends Component {

  constructor(props) {
    super(props)

    this.state = {
      remove: false,
      deltaPosition: {x: 0, y: 0},
      controlledPosition: {x: 0, y:0},
      hover: false
    }
  }

  defaultPosition = () => {
    var { defaultPosition, editorMode } = this.props;
    return {
      x: editorMode ? defaultPosition.x : this.props.startTime  * unitTime,
      y: computeTopPosition("#plane" + this.props.plane) - boxHeight/2
    }
  }

  updatePosition = () => {
    let {controlledPosition, deltaPosition} = this.state
    let updatedPosition = controlledPosition + deltaPosition
    this.setState({controlledPosition: updatedPosition})
    this.props.handleMove(this.props.arrayIndex, updatedPosition)
  }

  handleStart = (event) => {
    event.preventDefault()
    this.setState({
      deltaPosition: {x: 0, y:0}
    })
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
    this.updatePosition()

  }

  handleStop = (event) => {
    event.preventDefault()
    this.updatePosition()
  }

  render() {
    let {activity} = this.props
    return(
      <Draggable
        axis='x'
        id = {'drag_' + activity._id}
        defaultPosition={this.defaultPosition()}
        disabled={!this.props.editorMode}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}
        grid={[30, 20]}
        cancel="svg">
        <div  style={{position: 'relative', zIndex: 1}}>
          <div id = {activity._id}  style={divStyle(this.props.duration)}>
            <Anchor
              onClick={(event) => this.props.targetOperator(activity)}
              fill="white"
              id={"target" + activity._id}/>
            <span>  Plane {this.props.plane}
              {this.props.remove ?
                <button className="delete" onClick={(event) => this.props.delete(activity)}>&times;</button> : ""
              }
            </span>
            <Anchor
              onClick={(event) => this.props.sourceOperator(activity)}
              fill={this.props.isSourceClicked ? "red" : "white"}
              id={"source" + activity._id} />
          </div>
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
  handleMove: PropTypes.func.isRequired,
  arrayIndex: PropTypes.number.isRequired,
  remove: PropTypes.bool.isRequired,
  delete: PropTypes.func,
  sourceOperator: PropTypes.func,
  targetOperator: PropTypes.func,
  isSourceClicked: PropTypes.bool,
};
