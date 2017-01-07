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

const adjustToGrid = (number, interval) => {
  let remaining = number % interval
  return Math.round(number - remaining)
}

const convertTimeToPx = (unit, time, interval) => {
  return time / getUnitInSeconds(unit) * unitTime
}

const getUnitInSeconds = (unit) => {
  switch(unit) {
    case 'hour':
      return 3600.0
    case 'minute':
      return 60.0
    default: return 1.0
  }
}

const convertPxToTime = (unit, time) => {
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

const Anchor = ({id, fill, onClick}) => {
  return (
    <svg height={2*circleRadius} width={2*circleRadius} style={{position: "relative"}} onClick={onClick}>
      <circle cx={circleRadius} cy={circleRadius} r={circleRadius} stroke="black" fill={fill} id={id}/>
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

  defaultPosition = () => {
    var { defaultPosition, editorMode } = this.props;
    return {
      x: defaultPosition.x + this.state.leftBound,
      y: this.state.y
    }
  }

  updatePosition = (deltaPosition) => {
    const defaultPosition = this.state.totalPosition
    const updatedPosition = {x: deltaPosition.x, y: 0}
    const totalPosition = {x: updatedPosition.x + defaultPosition.x, y: updatedPosition.y + defaultPosition.y}
    this.setState({totalPosition: totalPosition})
    this.props.handleMove(this.props.arrayIndex, totalPosition)
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
    this.props.handleStop(this.props.arrayIndex, this.state.totalPosition)
    this.props.moveCursor(-1)
  }

  handleResize = (direction, styleSize, clientSize, delta, newPos) => {
    this.props.moveCursor(this.state.totalPosition.x + styleSize.width)
  }

  handleResizeStop = (direction, styleSize, clientSize, delta) => {
    updateGraphActivityDuration(this.props.activity._id, convertPxToTime('seconds', styleSize.width))
    this.props.moveCursor(-1)
  }

  render() {
    let {activity, editorMode} = this.props
    let duration = convertTimeToPx('seconds', activity.data.duration ? activity.data.duration : defaultTime, this.props.interval)
    return(
      <div style={{position: 'relative', zIndex: 0}}>
        <Rnd
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
          minWidth= {40}
          maxWidth= {400}
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
            {
              editorMode ?
                <div style={{position: 'relative', zIndex: 0}}>
                  <div style={{position: 'absolute', zIndex: 0, left:-circleRadius}}>
                    <Anchor
                    onClick={(event) => this.props.targetOperator(activity)}
                    fill="white"
                    id={"target" + this.props.graphId + activity._id}
                    />
                  </div>
                  <div style={{position: 'absolute', zIndex: 0, right:-circleRadius}}>
                    <Anchor
                    onClick={(event) => this.props.sourceOperator(activity)}
                    fill={this.props.isSourceClicked ? "red" : "white"}
                    id={"source" + this.props.graphId + activity._id}
                    />
                  </div>
                </div>
                : ""
            }
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
  handleMove: PropTypes.func,
  arrayIndex: PropTypes.number.isRequired,
  delete: PropTypes.func,
  sourceOperator: PropTypes.func,
  targetOperator: PropTypes.func,
  isSourceClicked: PropTypes.bool,
  interval: PropTypes.number.isRequired,
  graphId: PropTypes.string.isRequired,
  moveCursor:PropTypes.func,
};
