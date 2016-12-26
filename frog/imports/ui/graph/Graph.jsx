import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DraggableAc from './DraggableAc.jsx';
import Draggable from 'react-draggable';
import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'

import { $ } from 'meteor/jquery';

//to be put in graph.jxs
const AxisDisplay = ( {getRightMostPosition} ) => {
  return(
  <div>
    <svg width={getRightMostPosition()+"px"} height="200px" xmlns="http://www.w3.org/2000/svg" style={{overflowX: "auto"}}>
      <text x="0%" y="20%" id="plane1">Plane 1</text>
      <line x1="10%" y1="20%" x2="100%" y2="20%" style={{stroke: 'black', strokeWidth:"1"}} />

      <text x="0%" y="60%" id="plane2">Plane 2</text>
      <line x1="10%" y1="60%" x2="100%" y2="60%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x="0%" y="100%" id="plane3">Plane 3</text>
      <line x1="10%" y1="100%" x2="100%" y2="100%" style={{stroke: 'black', strokeWidth:"1"}}/>
    </svg>
  </div>
)}

const Separator = ( {id, onHover} ) => {
  return (
    <div id={id} onMouseOver={onHover}>
      <svg width="100%" height = "5px" xmlns="http://www.w3.org/2000/svg">
        <line x1="0%" y1="0%" x2="100%" y2="0%" style={{stroke: 'red', strokeWidth:"2"}} />
      </svg>
    </div>
  )
}

const Operators =  ({scroll, operators, getRightMostPosition}) => {
  return(
      <svg width={getRightMostPosition()+'px'} height = "200px" xmlns="http://www.w3.org/2000/svg" className="poulpe" style={{position: 'absolute', zIndex: 0}}>
        {operators.map( (operator, i) => {
          let tsp = computeTopPosition("#source" + operator.from._id)
          let ttp = computeTopPosition("#target" + operator.to._id)
          let lsp = computeLeftPosition("#source" + operator.from._id)
          let ltp = computeLeftPosition("#target" + operator.to._id)
          return (
            <line key ={i} x1={lsp + scroll} y1={tsp} x2={ltp + scroll} y2={ttp} style={{stroke:"blue", strokeWidth:"2", zIndex:10}}/>
          );
        })}
        </svg>
  );
}



const DragAc = ( {position, plane}) => {
  return (
    <Draggable
      position= {position}
      axis='both'
      disabled= {false}>
        <div style={divStyleNeg}>
          Plane {plane}
          {position.y}
        </div>
    </Draggable>
  )
}


const BoxAc = ( {hoverStart, hoverStop, plane} ) => {
  return(
    <div
      style={divStyleAc}
      onMouseOver={hoverStart}
      onMouseUp={hoverStop}>
      Plane {plane}
    </div>
  )
}

const RenderDraggable = ( { handleHoverStart, handleHoverStop, activities}) => {return(
    <div>
      <div style={divListStyle}>

        {activities.map((activity, i) => {
          return <BoxAc
          hoverStart={(event) => handleHoverStart(event, i%3 +1, activity)}
          hoverStop={handleHoverStop}
          key={i}
          plane={i%3 +1} />
        })}
      </div>

    </div>

  )
}

const TempAc = ({handleDragStop, position, plane, current}) => {
  return (
    <div id="dragac" style={{position: "absolute", zIndex: 2}} onMouseUp={(event) => handleDragStop(event, plane, current)}>
      {current ?
      <div  style={{position: "absolute"}}>
        <DragAc
          plane={plane}
          position={position}
        />
      </div>
    : "" }
    </div>
  )
}

const RenderGraph = ( {
  activities,
  positions,
  operators,
  scroll,
  deleteAc,
  handleMove,
  getRightMostPosition,
  sourceOperator,
  targetOperator,
  activitySourceClicked}) => {
  return(

      <div id='inner_graph' style={divStyle}>
        <div style={{position: "absolute"}}>
          <Operators scroll={$("#inner_graph").scrollLeft()} operators={operators} getRightMostPosition={getRightMostPosition} />
        </div>
        {activities.map( (activity, i) => {

          return (<DraggableAc
            activity={activity}
            editorMode={true}
            plane={positions[i].plane}
            key={activity._id}
            startTime={45}
            remove={true}
            duration={60}
            defaultPosition={positions[i].position}
            arrayIndex={i}
            handleMove={handleMove}
            delete = {deleteAc}
            sourceOperator = {sourceOperator}
            targetOperator = {targetOperator}
            isSourceClicked = {activitySourceClicked == activity ? true : false}
            />)
        })}

        <div style={{top: 50}} >
          <AxisDisplay getRightMostPosition={getRightMostPosition}/>
        </div>
      </div>

    );
}

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

export default class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addedActivities: [],
      addedPositions: [],
      currentDraggable: null,
      currentPlane: 0,
      defPos: {x: 0, y:0},
      separatorHeight: {top: 0, down: 0, left: 0},
      mousePosition: {x: 0, y:0},
      operators: [],
      currentSource: null,
      inner_scroll: 0
    };
  }

  componentDidMount() {
    let inner = $("#inner_graph").offset()
    let top = computeTopPosition("#top")
    let down = computeTopPosition("#down")
    this.setState({separatorHeight: {top: top, down: down, left: inner.left}})
  }

  handleHoverStart = (event, plane, activity) => {
    event.preventDefault();
    var pos = event.target.getBoundingClientRect()
    var width_correction = (pos.right - pos.left)/2.0
    var height_correction = (pos.bottom - pos.top)
    var x_corrected = pos.left + window.scrollX - this.state.separatorHeight.left
    var y_corrected = computeTopPosition(event.target)- this.state.separatorHeight.down - height_correction
    this.setState({
      currentPlane: plane,
      currentDraggable: activity,
      mousePosition: {x: x_corrected, y: y_corrected}})
  }

  handleHoverStop = (event) => {
    event.preventDefault();
    this.setState({currentDraggable: null});

  }

  deleteInGraphAc = (activity) => {
    var index = this.state.addedActivities.indexOf(activity)
    if(index != -1) {
      var activitiesLess =
        this.state.addedActivities.slice(0, index).concat(this.state.addedActivities.slice(index+1, this.state.addedActivities.drag))
      var positionsLess =
        this.state.addedPositions.slice(0, index).concat(this.state.addedPositions.slice(index+1, this.state.addedPositions.length))
      this.setState({addedActivities: activitiesLess, addedPositions: positionsLess})
    }

    
  }

  handleDragStop = (event, plane, activity) => {
    event.preventDefault();
    var {top, down} = this.state.separatorHeight
    var bpos = event.target.getBoundingClientRect();
    //TODO correct position
    let pos = {top: 250, left: bpos.left + window.scrollX}

    console.log("pos " + pos.top)
    console.log("expected " + top + " --- " + down)
    if(pos.top < down && pos.top > top) {

      let newActivity = _.clone(activity, true);
      newActivity._id = uuid();

      var innerGraphScrollX =  $("#inner_graph").scrollLeft()
      let correctedPosition = {x: pos.left, y: pos.top}
      //var correctedPosition = this.state.mousePosition
      console.log("position" + correctedPosition.x + correctedPosition.y)
      correctedPosition.x += innerGraphScrollX
      //correctedPosition.y += this.state.separatorHeight.top
      var newElement = {position: correctedPosition, plane: plane}
      newElement.plane += 0 //TODO insertion fail if a field of newElement is not used at least once before
      var activitiesMore = this.state.addedActivities.concat(newActivity)
      var positionsMore = this.state.addedPositions.concat(newElement)
      console.log("activities" + activitiesMore.length)
      this.setState({addedActivities: activitiesMore, addedPositions: positionsMore})
    }

    this.setState({currentDraggable: null});
  }

  handleMove = (arrayIndex, position) => {

    let activityMoved = this.state.addedPositions[arrayIndex]
    activityMoved.position = position
    let modifiedAddedPositions = this.state.addedPositions
      .slice(0, arrayIndex)
      .concat(activityMoved)
      .concat(this.state.addedPositions
                .slice(arrayIndex+1, this.state.addedPositions.length))
    this.setState({addedPositions: modifiedAddedPositions})
  }

  getRightMostPosition = () => {

    let position = this.state.addedPositions.indexOf(Math.max(...this.state.addedPositions.map(addedPosition => addedPosition.position.x)))
    return (position >= 1000) ? position : 1000;

  }

  sourceClicked = (source) => {
    this.setState({currentSource:source});
  }

  addNewOperator = (target) => {
    if(this.state.currentSource != null) {
      let newOperators = this.state.operators.concat({from:this.state.currentSource, to:target});
      this.setState({currentSource:null, operators:newOperators});
    }
  }

  render() {
    var position = this.state.mousePosition
    return (
      <div id="graph-summary" >
          <Separator id='top' key={1} style={{position: 'relative'}}/>

          <RenderGraph
            id = 'planes'
            scroll={this.state.inner_scroll}
            activities={this.state.addedActivities}
            positions={this.state.addedPositions}
            operators={this.state.operators}
            deleteAc={this.deleteInGraphAc}
            handleMove={this.handleMove}
            getRightMostPosition={this.getRightMostPosition}
            sourceOperator = {this.sourceClicked}
            targetOperator = {this.addNewOperator}
            activitySourceClicked = {this.state.currentSource}/>

          <Separator id='down' key={2} style = {{position: 'relative'}} />

          <TempAc
            handleDragStop = {this.handleDragStop}
            position = {position}
            plane = {this.state.currentPlane}
            current = {this.state.currentDraggable}/>

          <RenderDraggable
            id='list'
            handleHoverStart={this.handleHoverStart}
            handleHoverStop={this.handleHoverStop}
            activities = {this.props.activities}/>

      </div>
    );
  }
}


Graph.propTypes = {
  activities: PropTypes.array.isRequired,
};

const divStyle = {
  position: "static",
  zIndex: 0,
  height: 300,
  width: "100%",
  overflowX: "scroll",
  overflowY: "hidden",
  border: 2,
  borderStyle: "solid",
  borderColor: "yellow"
}

const divListStyle = {
  position: "relative",
  height: 300,
  width: "100%",
  border: 1,
  borderStyle: "solid",
  borderColor: "black"
}

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

const divStyleAc = {
  background: "white",
  border: 2,
  width: 60,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "relative",
  borderStyle: "solid",
  borderColor: "grey"

}
