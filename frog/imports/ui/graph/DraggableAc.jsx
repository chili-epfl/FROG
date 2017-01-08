import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Rnd from 'react-rnd';

import { updateGraphActivityDuration } from '../../api/activities'

import { $ } from 'meteor/jquery';

import ReactTooltip from 'react-tooltip'

const computeTopPosition = (object, graphId) => {
  let inner = $("#" + graphId + "inner_graph").offset().top
  let elem = $(object).offset().top
  return elem - inner
}

const computeLeftPosition = (object, graphId) => {
  let inner = $("#" + graphId + "inner_graph").offset().left
  let elem = $(object).offset().left
  return elem - inner
}

const unitTime = 1

const boxHeight = 40

const resizeStep = 25

const defaultTime = 10

const circleRadius = 6

const rndMargin = 12

const minRealBox = 45

const adjustToGrid = (number, interval) => {
  let remaining = number % interval
  return Math.round(number - remaining)
}

export const convertTimeToPx = (unit, time) => {
  return time / getUnitInSeconds(unit) * unitTime
}

const getUnitInSeconds = (unit) => {
  switch(unit) {
    case 'days':
      return 86400.0;
    case 'hours':
      return 3600.0;
    case 'minutes':
      return 60.0;
    default: return 1.0;
  }
}

export const convertPxToTime = (unit, time) => {
  return time * getUnitInSeconds(unit) / unitTime
}

const divStyle = (duration) => {
  return {
    background: "white",
    textAlign:"center",
    border: 2,
    width: duration,
    height: boxHeight,
    margin: 10,
    padding: 10,
    zIndex: 0,
    float: "left",
    position: "absolute",
    borderStyle: "solid",
    borderColor: "green"
  }
}

const Anchor = ({id, fill, onClick, duration}) => {
  return (
    <svg height={Math.min(2*circleRadius, 0.2*duration)} width={Math.min(2*circleRadius, 0.2*duration)} style={{position: "relative"}} onClick={onClick}>
      <circle cx="50%" cy="50%" r="50%" stroke="black" fill={fill} id={id}/>
    </svg>
  )
}

export default class DraggableAc extends Component {

  constructor(props) {
    super(props)

    this.state = {
      remove: false,
      hover: false,
      totalPosition: props.defaultPosition,
      totalDuration: props.duration,
      y: 0,
      leftBound: 109,
      moving: false,
      resizing: false,
    }
  }

  componentDidMount() {
    let {graphId} = this.props
    let newY = computeTopPosition("#" + graphId + "plane" + this.props.plane, graphId) - boxHeight/2
    let newLeftBound = computeLeftPosition("#" + graphId + "line1", graphId) - rndMargin

    if(this.state.y != newY || this.state.leftBound != newLeftBound) {
      this.setState({
        y: newY,
        leftBound: newLeftBound,
      })
    }

  }

  defaultPosition = (position=this.props.defaultPosition, scale=this.props.scale) => {
    return {
      x: convertTimeToPx(scale, position.x) + this.state.leftBound,
      y: this.state.y
    }
  }

  updatePosition = (deltaPosition) => {
    const defaultPosition = this.state.totalPosition
    const updatedPosition = {x: deltaPosition.x, y: 0}
    const totalPosition = {x: updatedPosition.x + defaultPosition.x, y: updatedPosition.y + defaultPosition.y}
    console.log("totPos" + totalPosition.x)
    this.setState({totalPosition: totalPosition})
    //this.props.handleMove(this.props.arrayIndex, totalPosition)
    this.props.moveCursor(totalPosition.x)
  }

  handleDrag = (event, ui) => {
    event.preventDefault();

    const deltaPosition = {
      x: ui.deltaX,
      y: ui.deltaY,
    };

    this.updatePosition(deltaPosition)
  }

  handleStop = (event) => {
    event.preventDefault()
    let scaledTotalPosition = {x: convertPxToTime(this.props.scale, this.state.totalPosition.x), y: this.state.totalPosition.y}
    this.props.handleStop(this.props.arrayIndex, scaledTotalPosition)
    this.props.moveCursor(-1)
  }

  handleResize = (direction, styleSize, clientSize, delta, newPos) => {
    this.props.moveCursor(this.state.totalPosition.x + styleSize.width)
    console.log("cursor " + (this.state.totalPosition.x + styleSize.width))
    this.props.handleResize(this.props.arrayIndex, styleSize.width)
  }

  handleResizeStop = (direction, styleSize, clientSize, delta) => {
    updateGraphActivityDuration(this.props.activity._id, convertPxToTime(this.props.scale, styleSize.width))
    this.props.moveCursor(-1)
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.scale != nextProps.scale || this.props.defaultPosition != nextProps.defaultPosition) {
      const position = this.defaultPosition(nextProps.defaultPosition, nextProps.scale)
      this.rnd.updatePosition({ x: position.x, y: position.y })
      const newTotalPosition = {x: position.x - this.state.leftBound, y: position.y}
      console.log("--- " + newTotalPosition.x)
      this.setState({totalPosition: newTotalPosition})
    }
  }

  render() {
    let {activity, editorMode} = this.props
    let duration = convertTimeToPx(this.props.scale, activity.data.duration ? activity.data.duration : defaultTime)
    return(
      <div style={{position: 'relative', zIndex: 0}}>
        <Rnd
          ref={c => { this.rnd = c }}
          moveAxis={this.props.editorMode ? 'x' : 'none'}
          id = {'drag_' + activity._id}
          initial={{
            x: this.defaultPosition().x,
            y: this.defaultPosition().y,
            height: 40,
            width: divStyle(duration).width
          }}
          isResizable= {{ top: false, right: editorMode, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
          bounds={{left: this.state.leftBound}}
          onDrag={this.handleDrag}
          onDragStop={this.handleStop}
          onResize={this.handleResize}
          onResizeStop={this.handleResizeStop}
          moveGrid={[editorMode ? 1 : 0, 0]}
          resizeGrid={[1, 0]}
          bounds={{left: this.state.leftBound}}
          zIndex={0}
          style={divStyle(duration)}
          >
          <span style={{position: 'relative', zIndex: 0}}>
            <div style={{position: 'relative', zIndex: 0}}>
              <div style={{position: 'absolute', zIndex: 0, left:-circleRadius}}>
                <Anchor
                onClick={(event) => editorMode ? this.props.targetOperator(activity) : event.preventDefault()}
                fill="white"
                id={"target" + this.props.graphId + activity._id}
                duration={duration}
                />
              </div>
              <div style={{position: 'absolute', zIndex: 0, right:-circleRadius}}>
                <Anchor
                onClick={(event) => editorMode ? this.props.sourceOperator(activity) : event.preventDefault()}
                fill={this.props.isSourceClicked ? "red" : "white"}
                id={"source" + this.props.graphId + activity._id}
                duration={duration}
                />
              </div>
            </div>
            {
              duration >= minRealBox ?
                          <div id = {activity._id}>
                            <span>
                              <span data-tip data-for={"tip" + activity._id}>
                                <i className="fa fa-info" />
                              </span>
                              {this.props.editorMode ?
                                <a
                                  onClick={(event) => this.props.delete(activity)}
                                  >
                                  <i className="fa fa-times" />
                                </a> : ""
                              }
                            </span>

                          </div>
                          : ""
            }
          </span>
        </Rnd>
      </div>

    );

  }
}

DraggableAc.propTypes = {
  activity: PropTypes.object.isRequired,
  editorMode: PropTypes.bool.isRequired,
  plane: PropTypes.number.isRequired,
  //handleMove: PropTypes.func,
  handleResize: PropTypes.func,
  arrayIndex: PropTypes.number.isRequired,
  delete: PropTypes.func,
  sourceOperator: PropTypes.func,
  targetOperator: PropTypes.func,
  isSourceClicked: PropTypes.bool,
  interval: PropTypes.number.isRequired,
  graphId: PropTypes.string.isRequired,
  moveCursor:PropTypes.func,
  scale: PropTypes.string,
};
