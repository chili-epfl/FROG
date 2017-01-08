import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Rnd from 'react-rnd';

import { updateGraphActivityDuration } from '../../api/activities'

import { $ } from 'meteor/jquery';

import ReactTooltip from 'react-tooltip'
import { computeTopPositionFromGraph, computeLeftPositionFromGraph,
          convertTimeToPx, convertPxToTime, textSizeAndMargin } from './graph_utils.js'


const unitTime = 1

const boxHeight = 40

const resizeStep = 25

const defaultTime = 10

const circleRadius = 6

const rndMargin = 12

const minRealBox = 45

const divStyle = (duration) => {
  return {
    background: "#337ab7",
    borderRadius: 4,
    textAlign:"center",
    width: duration,
    height: boxHeight,
    margin: 10,
    padding: 10,
    zIndex: 0,
    float: "left",
    border: 1,
    borderStyle: "solid",
    borderColor: "blue",
    position: "absolute",
  }
}

const Anchor = ({id, fill, onClick, duration}) => {
  return (
    <svg height={Math.min(2*circleRadius, 0.2*duration)} width={Math.min(2*circleRadius, 0.2*duration)}
          style={{position: "relative"}} onClick={onClick}>
      <circle cx="50%" cy="50%" r="50%" stroke="blue" fill={fill} id={id}/>
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
      moving: false,
      resizing: false,
    }
  }

  componentDidMount() {
    let {graphId} = this.props
    let newY = computeTopPositionFromGraph("#" + graphId + "plane" + this.props.plane, graphId) - boxHeight/2
    let newLeftBound = textSizeAndMargin - rndMargin

    if(this.state.y != newY) {
      this.setState({
        y: newY,
      })
    }

  }

  defaultPosition = (position=this.props.defaultPosition, scale=this.props.scale) => {
    return {
      x: convertTimeToPx(scale, position.x) + textSizeAndMargin - rndMargin,
      y: this.state.y
    }
  }

  updatePosition = (deltaPosition) => {
    const defaultPosition = this.state.totalPosition
    const updatedPosition = {x: deltaPosition.x, y: 0}
    const totalPosition = {x: updatedPosition.x + defaultPosition.x, y: updatedPosition.y + defaultPosition.y}
    this.setState({totalPosition: totalPosition})
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
  }

  handleResizeStop = (direction, styleSize, clientSize, delta) => {
    updateGraphActivityDuration(this.props.activity._id, convertPxToTime(this.props.scale, styleSize.width))
    this.props.moveCursor(-1, true)
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.scale != nextProps.scale || this.props.defaultPosition != nextProps.defaultPosition) {
      const position = this.defaultPosition(nextProps.defaultPosition, nextProps.scale)
      this.rnd.updatePosition({ x: position.x, y: position.y })
      const newTotalPosition = {x: position.x - (textSizeAndMargin - rndMargin), y: position.y}
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
            height: boxHeight,
            width: divStyle(duration).width
          }}
          isResizable= {{ top: false, right: editorMode, bottom: false, left: false, topRight: false,
                          bottomRight: false, bottomLeft: false, topLeft: false }}
          bounds={{left: textSizeAndMargin - rndMargin}}
          onDrag={this.handleDrag}
          onDragStop={this.handleStop}
          onResize={this.handleResize}
          onResizeStop={this.handleResizeStop}
          moveGrid={[editorMode ? 1 : 0, 0]}
          resizeGrid={[1, 0]}
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
            <div id = {activity._id} >
              <a data-tip data-for={"tip" + activity._id}>
                <i className="fa fa-info" style={{color: 'white'}}/>
              </a>
              {
                <span>
                  {this.props.editorMode && duration >= minRealBox ?
                    <a
                      onClick={(event) => this.props.delete(activity)}
                      >
                      <i className="fa fa-trash"  style={{color: 'white'}}/>
                    </a> : ""
                  }
                </span>
              }
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
