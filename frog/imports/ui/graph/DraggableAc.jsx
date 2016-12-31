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
    width: duration,
    height: boxHeight,
    margin: 10,
    padding: 10,
    zIndex: 1,
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
      resizing: false,
      oldXPos:-1,
      duration:this.props.duration,
    }
  }

  defaultPosition = () => {
    var { defaultPosition, editorMode } = this.props;
    return {
      x: editorMode ? defaultPosition.x : this.props.startTime  * unitTime,
      y: computeTopPosition("#plane" + this.props.plane) - boxHeight/2
    }
  }

  updatePosition = (deltaPosition) => {
    const defaultPosition = this.defaultPosition();
    const updatedPosition = {x: deltaPosition.x, y: 0}
    const totalPosition = {x: updatedPosition.x + defaultPosition.x, y: updatedPosition.y + defaultPosition.y}

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
  }

  onMove = (event) => {
    event.preventDefault();
    if(event.buttons === 0) {
      const posX = $("#draggable" + this.props.activity._id).offset().left + $("#draggable" + this.props.activity._id).outerWidth() 
         //+ $("#inner_graph").scrollLeft() - $("#inner_graph").position().left;
      const mouseX = event.clientX + window.scrollX

      if(Math.abs(mouseX - posX) <= 2) {
        //if(!this.state.resizing) {
          //this.setState({resizing: true})
          this.props.onStartResize(this.props.arrayIndex)
        //}
      }
      /*else {
        if(this.state.resizing) {
          this.setState({resizing: false})
        }
      }*/
      
    }
    /*else {
      if(this.state.resizing) {
        if(this.state.oldXPos == -1) {
          this.setState({oldXPos: event.clientX + window.scrollX});
        }
        else {
          if(event.clientX + window.scrollX > this.state.oldXPos) {
            
          }
          else if(event.clientX + window.scrollX < this.state.oldXPos) {

          }
          const newXPos = event.clientX + window.scrollX
          const newDuration = this.state.duration + newXPos - this.state.oldXPos;
          this.setState({oldXPos: newXPos, duration: newDuration});
        }
      }
    }
    */
  }

  render() {
    let {activity} = this.props
    return(
        <Draggable
          axis='x'
          id = {'drag_' + activity._id}
          defaultPosition={this.defaultPosition()}
          disabled={!this.props.editorMode || this.props.resizing}
          onStart={this.handleStart}
          onDrag={this.handleDrag}
          onStop={this.handleStop}
          grid={[30, 20]}
          cancel="svg"
          >
          <div  
            data-tip data-for={"tip" + activity._id} 
            style={{position: 'relative', zIndex: 1}}
            onMouseMove={this.onMove}
          >
            <div style={divStyle(this.props.size)} id = {"draggable" + activity._id}>

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

              <ReactTooltip
                id={"tip"+activity._id}
                place={this.props.plane == 1 ? "bottom" : this.props.plane == 2 ? "left" : "top"}
                type="light">
                Activity: {activity._id}
                <pre>{JSON.stringify(activity.data, null, 2)}</pre>
              </ReactTooltip>

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
  size: PropTypes.number.isRequired,
  handleMove: PropTypes.func.isRequired,
  arrayIndex: PropTypes.number.isRequired,
  remove: PropTypes.bool.isRequired,
  delete: PropTypes.func,
  sourceOperator: PropTypes.func,
  targetOperator: PropTypes.func,
  isSourceClicked: PropTypes.bool,
  onStartResize: PropTypes.func.isRequired,
  resizing: PropTypes.bool.isRequired,
};
