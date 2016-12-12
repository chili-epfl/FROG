import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import DraggableAc from './DraggableAc.jsx';
import Draggable from 'react-draggable';

import { $ } from 'meteor/jquery';
import jsPlumb from 'jsplumb';

//to be put in graph.jxs
const AxisDisplay = ( {getRightMostPosition} ) => { 
  if(getRightMostPosition() != 1000) alert(getRightMostPosition()+"px")
  return(
  <div>
    <svg width={getRightMostPosition()+"px"} height="200px" xmlns="http://www.w3.org/2000/svg" style={{overflowX: "auto"}}>
      <text x="0%" y="20%">Plane 1</text>
      <line x1="10%" y1="20%" x2="100%" y2="20%" style={{stroke: 'black', strokeWidth:"1"}} />

      <text x="0%" y="60%">Plane 2</text>
      <line x1="10%" y1="60%" x2="100%" y2="60%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x="0%" y="100%">Plane 3</text>
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
};

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
    <div style={{position: "absolute", zIndex:2}} onMouseUp={(event) => handleDragStop(event, plane, current)}>
      {current ?
      <div style={{position: "absolute"}}>
        <DragAc
          plane={plane}
          position={position}
        />
      </div>
    : "" }
    </div>
  )
}


const RenderGraph = ( {activities, positions, deleteAc, handleMove, getRightMostPosition}) => {
  return(

      <div id='inner_graph' style={divStyle}>
        {activities.map( (activity, i) =>
          <DraggableAc
            activity={activity}
            editorMode={true}
            plane={positions[i].plane}
            key={i}
            startTime={45}
            duration={60}
            defaultPosition={positions[i].position}
            arrayIndex={i}
            handleMove={handleMove}
            delete = {deleteAc}/>
        )}
        <div style={{top: 50}}>
          <AxisDisplay getRightMostPosition={getRightMostPosition}/>
        </div>

      </div>

    );
}

var jsp = null;

var common = {
    isSource:true,
    isTarget:true,
    connector: ["Straight"],
    endpoint: ['Rectangle', { width:10, height:8 } ],
    endpointStyle:{fillStyle:'rgb(243,229,0)'}
};

const wrapActivity = (activity) => {
  let id = $('#drag_' + activity._id)
  //jsp.makeSource(id, {anchor: 'Continuous'})
  //jsp.makeTarget(id, {anchor: 'Continuous'})
  //jsp.addEndpoint(id, {anchor: ["Left"]}, common)
  //jsp.addEndpoint(id, {anchor: ["Right"]}, common)
}

const wrapActivities = (activities) => {
  if (jsp == null) return

  activities.forEach( (activity) => {
    wrapActivity(activity)
  })
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
      mousePosition: {x: 0, y:0}
    };
  }

  componentDidMount() {
    /*
    var separator = {top: $("#top").offset().top, down: $("#down").offset().top, left: $("down").position().left}
    this.setState({separatorHeight: separator})
    */
    jsp = jsPlumb.getInstance()
    jsp.setContainer($('#inner_graph'))
  }

  handleHoverTopSeparator = (event) => {
    event.preventDefault()

    var pos = event.target.getBoundingClientRect()
    var down = this.state.separatorHeight.down
    this.setState({separatorHeight: {top: pos.top + window.scrollY, down: down, left:pos.left}});

  }

  handleHoverDownSeparator = (event) => {
    event.preventDefault()

    var pos = event.target.getBoundingClientRect()
    var top = this.state.separatorHeight.top
    this.setState({separatorHeight: {top: top, down: pos.top + window.scrollY, left:pos.left}});


  }

  handleHoverStart = (event, plane, activity) => {
    event.preventDefault();
    var pos = event.target.getBoundingClientRect()
    var width_correction = (pos.right - pos.left)/2.0
    var height_correction = (pos.bottom - pos.top)/2.0
    var x_corrected = pos.left + window.scrollX - this.state.separatorHeight.left
    var y_corrected = pos.top + window.scrollY - this.state.separatorHeight.down - height_correction
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
    var pos = event.target.getBoundingClientRect();

    if(pos.top < down - top && pos.top > top) {
      var innerGraphScrollX =  $("#inner_graph").scrollLeft()
      var correctedPosition = this.state.mousePosition
      correctedPosition.x += innerGraphScrollX
      var newElement = {position: correctedPosition, plane: plane}
      newElement.plane += 0 //TODO insertion fail if a field of newElement is not used at least once before
      var activitiesMore = this.state.addedActivities.concat(activity)
      var positionsMore = this.state.addedPositions.concat(newElement)
      wrapActivity(activity)
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

  render() {
    var position = this.state.mousePosition
    return (
      <div className="graph-summary">
          <div style={{position: 'relative'}}>

            <Separator id='top' key={1} onHover={this.handleHoverTopSeparator} />

            <RenderGraph
              activities={this.state.addedActivities}
              positions={this.state.addedPositions}
              deleteAc={this.deleteInGraphAc}
              handleMove={this.handleMove}
              getRightMostPosition={this.getRightMostPosition} />

            <Separator id='down' key={2} onHover={this.handleHoverDownSeparator} />

            <TempAc
              handleDragStop = {this.handleDragStop}
              position = {position}
              plane = {this.state.currentPlane}
              current = {this.state.currentDraggable}/>

            <RenderDraggable
              handleHoverStart={this.handleHoverStart}
              handleHoverStop={this.handleHoverStop}
              activities = {this.props.activities}/>
          </div>
      </div>
    );
  }
}


Graph.propTypes = {
  activities: PropTypes.array.isRequired,
};

const divStyle = {
  position: "relative",
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
