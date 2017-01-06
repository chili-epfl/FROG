import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Rnd from 'react-rnd';

import { updateGraphActivityDuration } from '../../api/activities'

import { $ } from 'meteor/jquery';

import ReactTooltip from 'react-tooltip'

const computeTopPosition = (object) => {
  let inner = $("#inner_graph").offset().top
  let elem = $(object).offset().top
  return elem - inner
}

const computeLeftPosition = (object) => {
  let inner = $("#inner_graph").offset().left
  let elem = $(object).offset().left
  return elem - inner
}

const unitTime = 2

const boxHeight = 40

const resizeStep = 25

const defaultTime = 10

const adjustToGrid = (number) => {
  let remaining = number % 30
  return Math.round(number - remaining)
}

const convertTimeToPx = (unit, time) => {
  return adjustToGrid(time / getUnitInSeconds(unit) * unitTime)
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
      hover: false,
      totalPosition: props.defaultPosition,
      y: 0,
      leftBound: 0
    }
  }

  componentDidMount() {

    this.setState({
      y: computeTopPosition("#plane" + this.props.plane) - boxHeight/2,
      leftBound: computeLeftPosition("#line")
    })

  }

  defaultPosition = () => {
    var { defaultPosition, editorMode } = this.props;
    return {
      x: defaultPosition.x,
      y: this.state.y
    }
  }

  updatePosition = (deltaPosition) => {
    const defaultPosition = this.state.totalPosition//this.defaultPosition();
    const updatedPosition = {x: deltaPosition.x, y: 0}
    const totalPosition = {x: updatedPosition.x + defaultPosition.x, y: updatedPosition.y + defaultPosition.y}
    //console.log("dd " + updatedPosition.x)
    this.setState({totalPosition: totalPosition})
    this.props.handleMove(this.props.arrayIndex, totalPosition)
  }

  handleStart = (event) => {
    event.preventDefault()
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
  }

  handleResizeStop = (direction, styleSize, clientSize, delta) => {
    updateGraphActivityDuration(this.props.activity._id, convertPxToTime('minute', styleSize.width))
  }

  render() {
    let {activity, editorMode} = this.props
    let duration = convertTimeToPx('minute', activity.data.duration ? activity.data.duration : defaultTime)
    //console.log(this.defaultPosition().x)
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
          bounds={{left: 69}}
          minWidth= {40}
          maxWidth= {400}
          onDragStart={this.handleStart}
          onDrag={this.handleDrag}
          onDragStop={this.handleStop}
          onResizeStop={this.handleResizeStop}
          moveGrid={[editorMode ? 30 : 0, 0]}
          resizeGrid={[30, 0]}
          bounds={{left: this.state.leftBound}}
          zIndex={0}
          style={divStyle(duration)}
          >
          <span style={{position: 'relative', zIndex: 0}}>
            <div id = {activity._id}>
              <Anchor
                onClick={(event) => this.props.targetOperator(activity)}
                fill="white"
                id={"target" + activity._id}/>
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
              <Anchor
                onClick={(event) => this.props.sourceOperator(activity)}
                fill={this.props.isSourceClicked ? "red" : "white"}
                id={"source" + activity._id} />

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
};
