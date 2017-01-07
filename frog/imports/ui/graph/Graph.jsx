import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import ReactDOM from 'react-dom';
import DraggableAc from './DraggableAc.jsx';
import Draggable from 'react-draggable';
import { uuid } from 'frog-utils'
import { sortBy, reverse, take, range } from 'lodash'

import { Activities, Operators, removeGraphActivity, addGraphActivity, addGraphOperator, modifyGraphOperator, removeGraphOperator, dragGraphActivity } from '../../api/activities';
import { addGraph } from '../../api/graphs';

import { $ } from 'meteor/jquery'
import ReactTooltip from 'react-tooltip'

const charSize = 11;
const interval = 30;
const graphSize = 300

//to be put in graph.jxs
const AxisDisplay = ({rightMostPosition, graphId}) => {
  const leftMargin = 10;
  const textSizeAndMargin = charSize*10 + leftMargin;
  return(
  <div>
    <svg width={rightMostPosition} height={graphSize} xmlns="http://www.w3.org/2000/svg" style={{overflowX: "scroll"}}>

      <text x={leftMargin} y="20%" id={graphId + "plane3"}>Class</text>
      <line id ={graphId + 'line3'} x1={textSizeAndMargin} y1="20%" x2="100%" y2="20%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x={leftMargin} y="50%" id={graphId + "plane2"}>Team</text>
      <line id ={graphId + 'line2'} x1={textSizeAndMargin} y1="50%" x2="100%" y2="50%" style={{stroke: 'black', strokeWidth:"1"}}/>

      <text x={leftMargin} y="80%" id={graphId + "plane1"}>Individual</text>
      <line id ={graphId + 'line1'} x1={textSizeAndMargin} y1="80%" x2="100%" y2="80%" style={{stroke: 'black', strokeWidth:"1"}} />

      <TimeAxis totalLeftMargin={textSizeAndMargin} width={rightMostPosition} interval={interval} unit="minutes"/>
    </svg>
  </div>
)}

const TimeAxis = ({totalLeftMargin, width, interval, unit}) => {
  return(
    <g>
    <line x1={totalLeftMargin} y1="90%" x2="100%" y2="90%" style={{stroke: 'black', strokeWidth:"1"}} />
    {
      _.range(0, width, interval).map((timeGraduated, i) => {
        return (
          <g key={i}>
            <line x1={totalLeftMargin + timeGraduated} y1="90%" x2={totalLeftMargin + timeGraduated} y2="92%" style={{stroke: 'black', strokeWidth:"1"}}/>
            <text x={totalLeftMargin + timeGraduated} y="93%" style={{writingMode: "tb", fontSize: "70%"}}>{timeGraduated}</text>
          </g>
          );
      })
    }
    </g>
  );
}

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
        data-tip data-for={"operator" + i} data-event-off='mouseDown'
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
      data-tip data-for={"operator" + i}  data-event-off='mouseDown'
      id={i}
      key ={i}
      d={"M" + (left + startX) + "," + (top + startY) + " c"+ cornerTop + "," + 0 + " " + cornerDown + "," + h + " " + w + "," + h}
      style={{fill: 'none', stroke: 'blue', strokeWidth: 5, zIndex: 10}}/>
  )
}



const RenderOperators =  ({operators, rightMostPosition, onClickOperator, clickedOperator, listAvailableOperators, planes, graphId, editorMode}) => {
  return(
      <g width={rightMostPosition} height={graphSize}  style={{position: 'absolute', zIndex: 0}}>
        {operators.map( (operator, i) => {
          let scroll = $("#" + graphId + "inner_graph").scrollLeft()
          let tsp = getHeight(operator.from.plane, planes)
          let ttp = getHeight(operator.to.plane, planes)
          let lsp = computeLeftPosition("#source" + graphId + operator.from._id, graphId)
          let ltp = computeLeftPosition("#target" + graphId + operator.to._id, graphId)
          let top = Math.min(tsp, ttp)
          let left = Math.min(lsp, ltp)
          let width = Math.abs(ltp-lsp)
          let height = Math.abs(tsp -ttp)
          let goUp = (top == ttp)
          let goRight = (left == lsp)
          return (
            <g key={"op"+i} width={Math.max(width, 5)}
                            height={Math.max(height, 5)}
                            x={top} y={left + scroll}
                            style={{zIndex: 0, position: 'absolute'}}
                            onClick={
                              (event) => editorMode ? onClickOperator(event, operator, left+width/2 + scroll, top+height/2) : null}>
              <OpPath up={goUp} right={goRight} i={i}
                      width={width} height={height}
                      leftSource={lsp} leftTarget={ltp}
                      top={top} left={left + scroll}/>
            </g>
          )
        })}
      </g>

  )
}
/*
const RenderOperators =  ({operators, rightMostPosition, loaded}) => {
  return(
      <g width={rightMostPosition + 'px'} height='300px'  style={{position: 'absolute', zIndex: 0}}>
        {operators.map( (operator, i) => {
          let scroll = $("#inner_graph").scrollLeft()
          let opos = loaded[i]
          let tsp = opos.tsp
          let ttp = opos.ttp
          let lsp = opos.lsp
          let ltp = opos.ltp
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
}*/

const DrawToolTip = ( {operators, activities, positions}) => {
  return(
    <span>
      {operators.map( (operator, i) => {
        return <ReactTooltip key={"optip" + i} id={"operator" + i} type="light" style={{position: 'absolute', zIndex: 10}}>
          Operator
          <pre>{
            JSON.stringify({"operator_type":operator.operator_type, "type":operator.type, "data":operator.data}, null, 2)
          }</pre>
        </ReactTooltip>
      })}
      {activities.map( (activity, i) => {
        return <ReactTooltip
          key={"actip" + i}
          id={"tip"+activity._id}
          place="bottom"
          type="light">
          Activity: {activity._id}
          <pre>{JSON.stringify(activity.data, null, 2)}</pre>
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

const RenderDraggable = ( { handleHover, handleHoverStop, activities}) => {return(
    <div>
      <div style={divListStyle}>

        {activities.map((activity, i) => {
          return <BoxAc
          onHoverStart={(event) => handleHover(event, i%3 +1, activity)}
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
  onClickOperator,
  clickedOperator,
  listAvailableOperators,
  deleteAc,
  handleMove,
  handleStop,
  sourceOperator,
  targetOperator,
  loaded,
  plane,
  graphId,
  activitySourceClicked}) => {
  const rightMostPosition = getRightMostPosition(positions);
  return(

      <div id={graphId + 'inner_graph'} style={divStyle}>
        <div style={{position:'relative'}}>
            <div style={{position: 'absolute', zIndex: 0}}>
              <svg xmlns="http://www.w3.org/2000/svg" style={{position: 'absolute', zIndex: 0}} width={rightMostPosition} height = {graphSize}>
              {loaded ?
                <RenderOperators
                  operators={operators}
                  rightMostPosition={rightMostPosition}
                  onClickOperator={onClickOperator}
                  clickedOperator={clickedOperator}
                  listAvailableOperators={listAvailableOperators}
                  planes={plane}
                  graphId={graphId}
                  editorMode={editorMode}/>
              : ""}
              </svg>

              <div style={{position:'relative'}}>
                {activities.map( (activity, i) => {
                  return (<DraggableAc
                    activity={activity}
                    editorMode={editorMode}
                    plane={activity.plane ? activity.plane : positions[i].plane}
                    key={activity._id}
                    defaultPosition={activity.position ? activity.position : positions[i].position}
                    arrayIndex={i}
                    handleMove={handleMove}
                    handleStop={handleStop}
                    delete = {deleteAc}
                    sourceOperator = {sourceOperator}
                    targetOperator = {targetOperator}
                    isSourceClicked = {activitySourceClicked == activity ? true : false}
                    interval = {interval}
                    graphId = {graphId}
                    />)
                })}
              </div>
            </div>
          {
            clickedOperator ? listAvailableOperators() : ""
          }
            </div>
          {loaded ?
            <DrawToolTip operators={operators} activities={activities} positions={positions}/>
          : ""}
        <div>
          <AxisDisplay rightMostPosition = {rightMostPosition} graphId={graphId}/>
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

export const computeTopPosition = (object, graphId) => {
  let elem = $(object).offset().top
  let inner = $("#" + graphId + "inner_graph").offset().top

  return elem - inner
}

const computeLeftPosition = (object, graphId) => {
  let inner = $("#" + graphId + "inner_graph").offset().left
  let elem = $(object).offset().left
  return elem - inner
}

const getHeight = (plane, planes) => {
  switch(plane) {
    case 1:
      return planes.plane1
    case 2:
      return planes.plane2
    case 3:
      return planes.plane3
  }
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
      currentDraggable: null,
      currentPlane: 0,
      defPos: {x: 0, y:0},
      hoverBoxPosition: {x: 0, y:0},
      addedOperators: props.addedOperators,
      currentSource: null,
      loaded: false,
      clickedOperator: null,
      clickedOperatorPosition: null,
      plane: {plane1: 0, plane2: 0, plane3: 0}
    };
  }

  componentDidMount() {
    let {graphId} = this.props
    console.log("mount")
    let plane1 = computeTopPosition("#" + graphId + "line1", graphId)
    let plane2 = computeTopPosition("#" + graphId + "line2", graphId)
    let plane3 = computeTopPosition("#" + graphId + "line3", graphId)
    this.setState({loaded: true, plane: {plane1: plane1, plane2:plane2, plane3:plane3}})
    this.props.handleLoaded()
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      addedActivities: nextProps.addedActivities,
      addedOperators: nextProps.addedOperators,
      loaded: nextProps.loaded
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.loaded) {
      this.setState({loaded: true})
      this.props.handleLoaded()
    }
  }

  handleHover = (event, plane, activity) => {
    event.preventDefault();
    let position = $("#box" + activity._id).position()

    this.setState({
      currentPlane: plane,
      currentDraggable: activity,
      hoverBoxPosition: {x: position.left, y: position.top}})

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

      this.setState({addedActivities: activitiesLess, addedPositions: positionsLess})
    }
    let filteredOperators = this.state.addedOperators.filter((operator) => {
      return (operator.from._id != activity._id && operator.to._id != activity._id)
    })
    let operatorsToDelete = this.state.addedOperators.forEach((operator) => {
      if (!(operator.from._id != activity._id && operator.to._id != activity._id)) {
        removeGraphOperator(operator._id, this.props.graphId)
        if(this.state.clickedOperator == operator) {
          this.setState({clickedOperator:null, clickedOperatorPosition:null})
        }
      }
    })
    removeGraphActivity(activity._id)

    this.setState({addedOperators: filteredOperators})

  }


  handleDragStop = (event, plane, activity) => {
    event.preventDefault();
    let {graphId} = this.props

    const top = $("#" + graphId + "inner_graph").offset().top
    const down = top + $("#" + graphId + "inner_graph").height();
    const posY = event.clientY + window.scrollY;

    //If we are within the bounds
    if(down > posY && posY > top) {
      //We clone the activity for the draggable element
      let newActivity = _.clone(activity, true);
      newActivity._id = uuid();

      const defaultTime = 60;
      newActivity.data.duration = newActivity.data.duration ? newActivity.data.duration : defaultTime;

      //We obtain the components to set its location in the graph (relative)
      const innerGraphScrollX =  $("#" + graphId + "inner_graph").scrollLeft() - $("#" + graphId + "inner_graph").position().left;
      const newY = computeTopPosition("#" + graphId + "plane" + plane, graphId) - 20; //20 is a constant so that the component
      //is not put under the line but on the line

      let newX = Math.max(event.clientX + window.scrollX + innerGraphScrollX - computeLeftPosition("#" + graphId + "line" + plane, graphId), 0)
      const remaining = newX % interval
      newX =  2*remaining>interval ? Math.round(newX + interval - remaining) : Math.round(newX - remaining)

      let newPosition = {x: newX, y: newY};
      let newElement = {position: newPosition, plane: plane};
      let newActivities = this.state.addedActivities.concat(newActivity);
      let newPositions = this.state.addedPositions.concat(newElement);

      addGraphActivity({ _id: activity._id, graphId: this.props.graphId, position: newPosition, data: activity.data, plane: plane})
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
      let newOperators = this.state.addedOperators.concat({from:this.state.currentSource, to:target});
      this.setState({currentSource:null, addedOperators:newOperators});
      const fromAc = {plane: this.state.currentSource.plane, _id: this.state.currentSource._id}
      const toAc = {plane: target.plane, _id: target._id}
      addGraphOperator({_id: uuid(), graphId: this.props.graphId, from: fromAc, to:toAc})
    }
  }

  clickedOperator = (event, operator, x, y) => {
    event.preventDefault();
    let {graphId} = this.props
    if(this.state.clickedOperator != operator) {
      $("#" + graphId + "inner_graph").scrollLeft() - $("#" + graphId + "inner_graph").position().left
      this.setState({clickedOperator:operator, clickedOperatorPosition:{x: x-75, y:y-19}})
    }
  }

  operatorChosen = (event) => {
    event.preventDefault();
    if(event.target.value >= 0) {
      const chosenOperator = this.props.operators[event.target.value];
      this.state.clickedOperator.operator_type = chosenOperator.operator_type;
      this.state.clickedOperator.type = chosenOperator.type;
      this.state.clickedOperator.data = chosenOperator.data;
      modifyGraphOperator(this.state.clickedOperator._id, chosenOperator.operator_type, chosenOperator.type, chosenOperator.data)
    }
    this.setState({clickedOperator:null, clickedOperatorPosition:null})
  }

  listAvailableOperators = () => {
    return (
      <div style={{position:'absolute', left:this.state.clickedOperatorPosition.x, top:this.state.clickedOperatorPosition.y, width:150, height:38}}>
        <select id="operators" size="2" onChange={(event) => this.operatorChosen(event)}>
          {
            this.props.operators.length == 0 ? <option disabled>No operator to choose</option> : ""
          }
          <option key={"cancel"} value={-1}>Cancel</option>
          {
            this.props.operators.map((operator, i) => {
              return <option key={"choice"+i} value={i}>
                        {operator.operator_type}
                     </option>
            })
          }
        </select>
      </div>
    )
  }



  render() {
    return (
      <div id="graph-summary" >
          <br />
          <RenderGraph
            id = 'planes'
            editorMode={true}
            activities={this.state.addedActivities}
            positions={this.state.addedPositions}
            operators={this.state.addedOperators}
            onClickOperator={this.clickedOperator}
            clickedOperator={this.state.clickedOperator}
            listAvailableOperators={this.listAvailableOperators}
            deleteAc={this.deleteInGraphAc}
            handleMove={this.handleMove}
            handleStop={this.handleStop}
            sourceOperator = {this.sourceClicked}
            targetOperator = {this.addNewOperator}
            activitySourceClicked = {this.state.currentSource}
            loaded={this.state.loaded}
            plane={this.state.plane}
            graphId={this.props.graphId}
            />
          <br/>
          {
            this.props.activities.length == 0 ?
              <div style = {divListStyleNoActivity}>
                <br/>
                <span>No activities</span>
                <br/>
                <br/>
              </div>
              :
              <div>
                <TempAc
                  handleDragStop = {this.handleDragStop}
                  position = {this.state.hoverBoxPosition}
                  plane = {this.state.currentPlane}
                  current = {this.props.activities.includes(this.state.currentDraggable) ? this.state.currentDraggable : null}/>
                <RenderDraggable
                  id='list'
                  handleHover={this.handleHover}
                  handleHoverStop={this.handleHoverStop}
                  activities = {this.props.activities}/>
              </div>
          }

      </div>
    );
  }
}


Graph.propTypes = {
  activities: PropTypes.array.isRequired,
  operators: PropTypes.array.isRequired,
  graphId: PropTypes.string.isRequired,
};

/*export default createContainer(
  (props) => {
    const user = Meteor.users.findOne({_id:Meteor.userId()})

    let currentGraphId = ""
    if(user.profile && user.profile.editingGraph) {
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
)*/

export default createContainer(
  (props) => {
    return({
      ...props,
      addedActivities: Activities.find({ graphId: props.graphId }).fetch(),
      addedOperators: Operators.find({ graphId: props.graphId }).fetch()
    })
  },
  Graph
)


const divStyle = {
  position: "static",
  zIndex: 0,
  display:"inline-block",
  //height: 300,
  width: "100%",
  overflowX: "scroll",
  overflowY: "hidden",
  border: 1,
  borderStyle: "solid",
  borderColor: "black",
}

const divListStyle = {
  position: "relative",
  display:"inline-block",
  width: "100%",
  border: 1,
  borderStyle: "solid",
  borderColor: "black"
}

const divListStyleNoActivity = {
  position: "relative",
  display:"inline-block",
  width: "100%",
  border: 1,
  textAlign:"center",
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
