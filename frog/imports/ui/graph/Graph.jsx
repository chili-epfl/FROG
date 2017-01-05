import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom';
import DraggableAc from './DraggableAc.jsx';
import Draggable from 'react-draggable';
import { uuid } from 'frog-utils'
import { sortBy, reverse, take } from 'lodash'

import { Activities, Operators, removeGraphActivity, addGraphActivity, addGraphOperator, removeGraphOperator, dragGraphActivity, removeGraph } from '../../api/activities';
import { addGraph } from '../../api/graphs';

import { $ } from 'meteor/jquery'
import ReactTooltip from 'react-tooltip'

//to be put in graph.jxs
const AxisDisplay = ({rightMostPosition}) => {
  return(
  <div>
    <svg width={rightMostPosition+"px"} height="300px" xmlns="http://www.w3.org/2000/svg" style={{overflowX: "scroll"}}>
      <text x="0" y="20%" id="plane1">Plane 1</text>
      <line id='line' x1={charSize * 7} y1="20%" x2="100%" y2="20%" style={{stroke: 'black', strokeWidth:"1"}} />

      <text x="0" y="50%" id="plane2">Plane 2</text>
      <line x1={charSize * 7} y1="50%" x2="100%" y2="50%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x="0" y="80%" id="plane3">Plane 3</text>
      <line x1={charSize * 7} y1="80%" x2="100%" y2="80%" style={{stroke: 'black', strokeWidth:"1"}}/>
    </svg>
  </div>
)}

//const TimeAxis = ({})

const Separator = ( {id, onHover} ) => {
  return (
    <div id={id} onMouseOver={onHover}>
      <svg width="100%" height = "5px" xmlns="http://www.w3.org/2000/svg">
        <line x1="0%" y1="0%" x2="100%" y2="0%" style={{stroke: 'red', strokeWidth:"2"}} />
      </svg>
    </div>
  )
}

const OpPath = ({up, right, i, width, height, leftSource, leftTarget, top, left}) => {
  let cornerTop = 0
  let cornerDown = 0
  let startX = 0
  let startY = 0
  let w = width
  let h = height
  //If the source is up left
  if(!up && right) {
    cornerTop = 80
    cornerDown = width - 80
  }
  //If the source is up right
  else if (!up && !right) {
    startX = width
    cornerTop =  - 80
    cornerDown = 80 - width
    w = -width
  }
  //If the source is bottom left
  else if (up && right) {
    cornerTop = 80
    cornerDown =  width - 80
    startY = height
    h = -height
  }
  //If the source is bottom right
  else {
    startX = width
    cornerTop = -80
    cornerDown = 80 - width
    startY = height
    h = -height
    w = -width
  }

  if(Math.abs(leftSource-leftTarget) < 30) {
    return (
      <line
        data-tip data-for={"operator" + i} data-event='click focus'
        id={i}
        key ={i}
        x1={right ? width + left : left}
        y1={up ? top : top + height}
        x2={right ? left : left + width}
        y2={up ? height + top : top}
        style={{stroke:"blue", strokeWidth:"5", zIndex:10}}/>
    )
  }

  return(
    <path
      data-tip data-for={"operator" + i} data-event='click focus'
      id={i}
      key ={i}
      d={"M" + (left + startX) + "," + (top + startY) + " c"+ cornerTop + "," + 0 + " " + cornerDown + "," + h + " " + w + "," + h}
      style={{fill: 'none', stroke: 'blue', strokeWidth: 5, zIndex: 10}}/>
  )
}

const RenderOperators =  ({operators, rightMostPosition}) => {
  return(
      <g width={rightMostPosition + 'px'} height='300px'  style={{position: 'absolute', zIndex: 0}}>
        {operators.map( (operator, i) => {
          let scroll = $("#inner_graph").scrollLeft()
          let tsp = computeTopPosition("#source" + operator.from)
          let ttp = computeTopPosition("#target" + operator.to)
          let lsp = computeLeftPosition("#source" + operator.from)
          let ltp = computeLeftPosition("#target" + operator.to)
          let top = Math.min(tsp, ttp)
          let left = Math.min(lsp, ltp)
          let width = Math.abs(ltp-lsp)
          let height = Math.abs(tsp -ttp)
          let goUp = (top == ttp)
          let goRight = (left == lsp)
          return (
            <g key={i} width={Math.max(width, 5)} height={Math.max(height, 5)} x={top} y={left + scroll} style={{zIndex: 0, position: 'absolute'}}>
              <OpPath up={goUp} right={goRight} i={i} width={width} height={height} leftSource={lsp} leftTarget={ltp} top={top} left={left + scroll}/>
            </g>
          )
        })}
      </g>

  )
}

const DrawToolTip = ( {operators, activities, positions}) => {
  return(
    <span>
      {operators.map( (operator, i) => {
        return <ReactTooltip key={"optip" + i} id={"operator" + i} type="light" effect='float' style={{position: 'absolute', zIndex: 10}}>Operator</ReactTooltip>
      })}
      {activities.map( (activity, i) => {
        return <ReactTooltip
          key={"actip" + i}
          id={"tip"+activity._id}
          place={activity.plane == 1 ? "bottom" : activity.plane == 2 ? "left" : "top"}
          type="light">
          Activity: {activity._id}
          <pre>{JSON.stringify(activity, null, 2)}</pre>
        </ReactTooltip>
      })}
    </span>
  )
}


const DragAc = ( {activity, position, plane}) => {
  return (
    <Draggable
      position= {position}
      axis='both'
      disabled= {false}>
        <div data-tip data-for="dragac_tip" data-event-off='mouseDown'
            style={divStyleNeg(activity)}>
          {activity.data.name}
          <ReactTooltip
            id="dragac_tip"
            type="light"
            effect="solid">
            <pre>{JSON.stringify(activity.data, null, 2)}</pre>
          </ReactTooltip>
        </div>
    </Draggable>
  )
}


const BoxAc = ( {onHoverStart, hoverStop, plane, activity} ) => {

  return(
    <div
      id={"box" + activity._id}
      style={divStyleAc()}
      onMouseOver={onHoverStart}
      onMouseUp={hoverStop}>
      {activity.data.name}
    </div>
  )
}

const RenderDraggable = ( { handleClick, handleHoverStop, activities}) => {return(
    <div>
      <div style={divListStyle}>

        {activities.map((activity, i) => {
          return <BoxAc
          onHoverStart={(event) => handleClick(event, i%3 +1, activity)}
          hoverStop={handleHoverStop}
          key={i}
          activity={activity}
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
          activity={current}
          plane={plane}
          position={position}
        />
      </div>
    : "" }
    </div>
  )
}

export const RenderGraph = ( {
  editorMode,
  activities,
  positions,
  sizes,
  operators,
  deleteAc,
  handleMove,
  handleStop,
  sourceOperator,
  targetOperator,
  loaded,
  activitySourceClicked}) => {

  const rightMostPosition = getRightMostPosition(positions);
  return(

      <div id='inner_graph' style={divStyle}>
        <div style={{position:'relative'}}>
            <div style={{overflowX: "none", position: 'absolute', zIndex: 0}}>
              <div style={{position:'relative'}}>
                {activities.map( (activity, i) => {
                  return (<DraggableAc
                    activity={activity}
                    editorMode={editorMode}
                    plane={activity.plane ? activity.plane : positions[i].plane}
                    key={activity._id}
                    startTime={45}
                    remove={true}
                    duration={60}
                    defaultPosition={activity.position ? activity.position : positions[i].position}
                    arrayIndex={i}
                    handleMove={handleMove}
                    handleStop={handleStop}
                    delete = {deleteAc}
                    sourceOperator = {sourceOperator}
                    targetOperator = {targetOperator}
                    isSourceClicked = {activitySourceClicked == activity ? true : false}
                    />)
                })}
              </div>

            <svg>
            {loaded ?
            <RenderOperators operators={operators} rightMostPosition={rightMostPosition} />
            : ""}
            </svg>
            </div>
        </div>
        <DrawToolTip operators={operators} activities={activities} positions={positions}/>
        <div style={{top: 50}} >
          <AxisDisplay rightMostPosition = {rightMostPosition} />
        </div>
      </div>

    );
}

const getRightMostPosition = (positions) => {
    let rightMostPosition = 0

    if(positions.length > 0) {
      let mappedPosition = positions.map(position => {return position.position.x})
      rightMostPosition = Math.max(...mappedPosition)
    }

    return (rightMostPosition >= 1000) ? rightMostPosition + 300 : 1100;
}

const computeTopPosition = (object) => {
  let elem = $(object).offset().top
  let inner = $("#inner_graph").offset().top

  return elem - inner
}

const computeLeftPosition = (object) => {
  let inner = $("#inner_graph").offset().left
  let elem = $(object).offset().left
  return elem - inner
}

class Graph extends Component {
  constructor(props) {
    super(props);
    let positions = props.addedActivities.map( (activity) => {
      return {
        plane: activity.plane,
        position: activity.position
      }
    })
    this.state = {
      addedActivities: props.addedActivities,
      addedPositions: positions,
      addedSizes: [],
      currentDraggable: null,
      currentResizable: -1,
      oldXPos:-1,
      currentPlane: 0,
      defPos: {x: 0, y:0},
      hoverBoxPosition: {x: 0, y:0},
      addedOperators: props.addedOperators,
      currentSource: null,
      loaded: false
    };
  }

  componentDidMount() {
    this.setState({loaded: true})
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      addedActivities: nextProps.addedActivities
    })
  }

  handleClick = (event, plane, activity) => {
    event.preventDefault();
    //if(event.buttons === 0) {
      let position = $("#box" + activity._id).position()

      this.setState({
        currentPlane: plane,
        currentDraggable: activity,
        hoverBoxPosition: {x: position.left, y: position.top}})
    //}
  }

  handleHoverStop = (event) => {
    event.preventDefault();
    this.setState({currentDraggable: null});

  }


  deleteInGraphAc = (activity) => {
    var index = this.state.addedActivities.indexOf(activity)
    if(index != -1) {
      var activitiesLess =
        this.state.addedActivities.slice(0, index).concat(
          this.state.addedActivities.slice(index+1, this.state.addedActivities.drag));
      var positionsLess =
        this.state.addedPositions.slice(0, index).concat(
          this.state.addedPositions.slice(index+1, this.state.addedPositions.length));
      var sizesLess =
        this.state.addedSizes.slice(0, index).concat(
          this.state.addedSizes.slice(index+1, this.state.addedSizes.length));
      this.setState({addedActivities: activitiesLess, addedPositions: positionsLess, addedSizes:sizesLess})
    }
    let filteredOperators = this.state.addedOperators.filter((operator) => {
      return (operator.from != activity._id && operator.to != activity._id)
    })
    let operatorsToDelete = this.state.addedOperators.forEach((operator) => {
      if (!(operator.from != activity._id && operator.to != activity._id)) {
        removeGraphOperator(operator._id, this.props.graphId)
      }
    })
    removeGraphActivity(activity._id)

    this.setState({addedOperators: filteredOperators})

  }


  handleDragStop = (event, plane, activity) => {
    event.preventDefault();

    const top = $("#inner_graph").offset().top
    const down = top + $("#inner_graph").height();
    const posY = event.clientY + window.scrollY;

    //If we are within the bounds
    if(down > posY && posY > top) {
      //We clone the activity for the draggable element
      let newActivity = _.clone(activity, true);
      newActivity._id = uuid();

      const defaultTime = 10;
      newActivity.data.duration = newActivity.data.duration ? newActivity.data.duration : defaultTime;

      //We obtain the components to set its location in the graph (relative)
      const innerGraphScrollX =  $("#inner_graph").scrollLeft() - $("#inner_graph").position().left;
      const planeY = computeTopPosition("#plane" + plane) - 20; //20 is a constant so that the component
      //is not put under the line but on the line

      let newPosition = {x: event.clientX + window.scrollX + innerGraphScrollX, y: planeY};
      let newElement = {position: newPosition, plane: plane};
      let newActivities = this.state.addedActivities.concat(newActivity);
      let newPositions = this.state.addedPositions.concat(newElement);

      let newSizes = this.state.addedSizes.concat(100);
      addGraphActivity({ _id: newActivity._id, graphId: this.props.graphId, position: newPosition, data: newActivity.data, plane: plane})
      this.setState({addedActivities: newActivities, addedPositions: newPositions})
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

  handleStop = (arrayIndex, position) => {
    this.handleMove(arrayIndex, position)
    dragGraphActivity(this.state.addedActivities[arrayIndex]._id, position)
  }

  /*
  handleResize = (event) => {
    event.preventDefault();

    if(this.state.currentResizable != -1) {

      const posX = $("#draggable" + this.state.addedActivities[this.state.currentResizable]._id).offset().left
        + $("#draggable" + this.state.addedActivities[this.state.currentResizable]._id).outerWidth()
      const mouseX = event.clientX + window.scrollX

      if(event.buttons !== 0) {
        if(this.state.oldXPos == -1) {
          this.setState({oldXPos: event.clientX + window.scrollX});
        }
        else {
          let newDuration = mouseX - $("#draggable" + this.state.addedActivities[this.state.currentResizable]._id).offset().left;
          newDuration = newDuration < 100 ? 100 : newDuration;

          let modifiedAddedSizes = this.state.addedSizes
            .slice(0, this.state.currentResizable)
            .concat(newDuration)
            .concat(this.state.addedSizes
                      .slice(this.state.currentResizable+1, this.state.addedSizes.length))

          this.setState({oldXPos: mouseX, addedSizes: modifiedAddedSizes});
        }

      }
      else if(Math.abs(mouseX - posX) > 2) {
        this.setState({currentResizable: -1, oldXPos:-1});
      }
    }
  }
  */

  sourceClicked = (source) => {
    if(source === this.state.currentSource) {
      this.setState({currentSource:null});
    }
    else {
      this.setState({currentSource:source});
    }
  }

  addNewOperator = (target) => {
    if(this.state.currentSource != null) {
      let newOperators = this.state.addedOperators.concat({from:this.state.currentSource._id, to:target._id});
      this.setState({currentSource:null, addedOperators:newOperators});
      addGraphOperator({_id: uuid(), graphId: this.props.graphId, from: this.state.currentSource._id, to:target._id})
    }
  }

  render() {
    return (
      <div id="graph-summary" >
          <RenderGraph
            id = 'planes'
            editorMode={true}
            activities={this.state.addedActivities}
            positions={this.state.addedPositions}
            operators={this.state.addedOperators}
            deleteAc={this.deleteInGraphAc}
            handleMove={this.handleMove}
            handleStop={this.handleStop}
            sourceOperator = {this.sourceClicked}
            targetOperator = {this.addNewOperator}
            activitySourceClicked = {this.state.currentSource}
            loaded={this.state.loaded}
            />

          <TempAc
            handleDragStop = {this.handleDragStop}
            position = {this.state.hoverBoxPosition}
            plane = {this.state.currentPlane}
            current = {this.props.activities.includes(this.state.currentDraggable) ? this.state.currentDraggable : null}/>

          <RenderDraggable
            id='list'
            handleClick={this.handleClick}
            handleHoverStop={this.handleHoverStop}
            activities = {this.props.activities}/>

      </div>
    );
  }
}


Graph.propTypes = {
  activities: PropTypes.array.isRequired,
  operators: PropTypes.array.isRequired,
};

export default createContainer(
  (props) => {
    const user = Meteor.users.findOne({_id:Meteor.userId()})

    let curentGraphId = ""
    if(user.profile) {
      currentGraphId = user.profile.editingGraph
    } else {
      currentGraphId = addGraph()
      Meteor.users.update({_id:Meteor.userId()},{$set: {'profile.editingGraph': currentGraphId}})
    }
    return({
      ...props,
      graphId: currentGraphId,
      addedActivities: Activities.find({ graphId: currentGraphId }).fetch(),
      addedOperators: Operators.find({ graphId: currentGraphId }).fetch()
    })
  },
  Graph
)

const charSize = 12;

const divStyle = {
  position: "static",
  zIndex: 0,
  height: 300,
  width: "100%",
  overflowX: "scroll",
  overflowY: "hidden",
  border: 2,
  borderStyle: "solid",
  borderColor: "yellow",
}

const divListStyle = {
  position: "relative",
  height: 300,
  width: "100%",
  border: 1,
  borderStyle: "solid",
  borderColor: "black"
}

const divStyleNeg = (activity) => { return {

  background: "white",
  border: 2,
  width: $("#box" + activity._id).outerWidth(),
  height: $("#box" + activity._id).outerHeight(),
  margin: 10,
  padding: 10,
  float: "left",
  position: "absolute",
  borderStyle: "solid",
  borderColor: "red"
  }
}

const divStyleAc = () => { return {
  background: "white",
  border: 2,
  height: 40,
  margin: 10,
  padding: 10,
  float: "left",
  position: "relative",
  borderStyle: "solid",
  borderColor: "grey"
  }
}
