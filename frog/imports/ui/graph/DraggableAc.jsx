import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import Rnd from 'react-rnd';

import { $ } from 'meteor/jquery';

import ReactTooltip from 'react-tooltip'

const computeTopPosition = (object) => {
  let inner = $("#inner_graph").offset().top
  let elem = $(object).offset().top
  return elem - inner
}

const unitTime = 2

const boxHeight = 40

const resizeStep = 25

const divStyle = (duration) => {
  return {
    background: "white",
    textAlign:"center",
    border: 2,
    width: duration*unitTime,
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
      totalPosition: 0,
      y: 0
    }
  }

  componentDidMount() {
    this.setState({y: computeTopPosition("#plane" + this.props.plane) - boxHeight/2})
  }

  defaultPosition = () => {
    var { defaultPosition, editorMode } = this.props;
    return {
      x: editorMode ? defaultPosition.x : this.props.startTime  * unitTime,
      y: this.state.y
    }
  }

  updatePosition = (deltaPosition) => {
    const defaultPosition = this.defaultPosition();
    const updatedPosition = {x: deltaPosition.x, y: 0}
    const totalPosition = {x: updatedPosition.x + defaultPosition.x, y: updatedPosition.y + defaultPosition.y}
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

  render() {
    let {activity} = this.props
    return(
      <div style={{position: 'relative', zIndex: 0}}>
        <Rnd
          moveAxis={this.props.editorMode ? 'x' : 'none'}
          id = {'drag_' + activity._id}
          initial={{
            x: this.defaultPosition().x,
            y: this.defaultPosition().y,
            height: 40,
            width: divStyle(this.props.duration).width
          }}
          isResizable= {{ top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
          minWidth= {40}
          maxWidth= {400}
          onDragStart={this.handleStart}
          onDrag={this.handleDrag}
          onDragStop={this.handleStop}
          moveGrid={[30, 20]}
          resizeGrid={[30, 0]}
          zIndex={0}
          style={divStyle(this.props.duration)}
          >
          <span  data-tip data-for={"tip" + activity._id} style={{position: 'relative', zIndex: 0}}>
            <div id = {activity._id}>
              <Anchor
                onClick={(event) => this.props.targetOperator(activity)}
                fill="white"
                id={"target" + activity._id}/>
              <span>
                {this.props.remove ?
                  <button className="delete" onClick={(event) => this.props.delete(activity)}>&times;</button> : ""
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
