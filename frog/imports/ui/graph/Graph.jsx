import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data'
import { clone, range } from 'lodash'
import Draggable from 'react-draggable';
import { $ } from 'meteor/jquery'
import ReactTooltip from 'react-tooltip'
import { uuid } from 'frog-utils'

import DraggableAc from './DraggableAc.jsx';
import { Activities, Operators, removeGraphActivity, addGraphActivity, addGraphOperator,
        modifyGraphOperator, removeGraphOperatorsLinkedToActivity, removeGraphOperator,
        dragGraphActivitySet } from '../../api/activities';

import { computeTopPositionFromGraph, computeLeftPositionFromGraph, convertTimeToPx,
          convertPxToTime, scrollGraph, scales, leftMargin, textSizeAndMargin, interval,
          graphSize, horizontalZoom } from './graph_utils.js'


const AxisDisplay = ({ rightMostPosition, graphId, cursor, scale }) => {
return(
  <div>
    <svg
      width={rightMostPosition + textSizeAndMargin}
      height={ graphSize }
      xmlns='http://www.w3.org/2000/svg'
      style={{ overflowX: 'auto'}}
    >

      <text x={leftMargin} y='18%' id={graphId + 'plane3'}>Class</text>
      <line
        id={graphId + 'line3'} x1={textSizeAndMargin} y1='18%'
        x2='100%' y2='18%' style={{ stroke: 'black', strokeWidth: '1' }}
      />

      <text x={leftMargin} y='43%' id={graphId + 'plane2'}>Team</text>
      <line
        id={graphId + 'line2'} x1={textSizeAndMargin} y1='43%'
        x2='100%' y2='43%' style={{ stroke: 'black', strokeWidth: '1' }}
      />

      <text x={leftMargin} y='68%' id={graphId + 'plane1'}>Individual</text>
      <line
        id={graphId + 'line1'} x1={textSizeAndMargin} y1='68%'
        x2='100%' y2='68%' style={{ stroke: 'black', strokeWidth: '1' }}
      />

      <TimeAxis totalLeftMargin={textSizeAndMargin} width={rightMostPosition} unit={scale} cursor={cursor} />
    </svg>
  </div>
)}

const TimeAxis = ({totalLeftMargin, width, unit, cursor}) => {
  return(
    <g>
      <line x1={totalLeftMargin} y1='90%' x2='100%' y2='90%' style={{ stroke: 'black', strokeWidth: '1' }} />
      <text x={leftMargin} y='90%'>Time ({unit})</text>
      {
        <g>
          {
            range(0, width+totalLeftMargin, interval).map((timeGraduated, i) => {
              if (cursor != -1 && Math.abs(timeGraduated - cursor) < interval/2) {
                return ''
              }
              return (
                <g key={i}>
                  <line
                    x1={totalLeftMargin + timeGraduated} y1='90%'
                    x2={totalLeftMargin + timeGraduated} y2='92%' style={{stroke: 'black', strokeWidth:'1'}} />
                  <text
                    x={totalLeftMargin + timeGraduated} y='93%'
                    style={{ writingMode: 'tb', fontSize: '65%' }}>{timeGraduated/horizontalZoom}</text>
                </g>
              );

            })
          }
          {
            (cursor >= 0) ?
              <g>
                <line
                  x1={totalLeftMargin + cursor} y1='90%'
                  x2={totalLeftMargin + cursor} y2='92%' style={{ stroke: 'black', strokeWidth: '1' }} />
                <text
                  x={totalLeftMargin + cursor} y='93%'
                  style={{ writingMode: 'tb', fontSize: '65%' }}>{cursor / horizontalZoom}</text>
              </g>
              : ''
          }
        </g>
      }
    </g>
  );
}

const OpPath = ({up, right, i, width, height, leftSource, leftTarget, top, left}) => {
  let cornerTop = 0
  let cornerDown = 0
  let startX = 0
  let startY = 0
  let w = width
  let h = height
  // If the source is up left
  if (!up && right) {
    cornerTop = 80
    cornerDown = width-80
  }
  // If the source is up right
  else if (!up && !right) {
    startX = width
    cornerTop = -80
    cornerDown = 80-width
    w = -width
  }
  // If the source is bottom left
  else if (up && right) {
    cornerTop = 80
    cornerDown =  width-80
    startY = height
    h = -height
  }
  // If the source is bottom right
  else {
    startX = width
    cornerTop = -80
    cornerDown = 80-width
    startY = height
    h = -height
    w = -width
  }

  if (Math.abs(leftSource-leftTarget) < 30) {
    return (
      <line
        data-tip data-for={'operator' + i} data-event-off='mouseDown'
        id={i}
        key ={i}
        x1={right ? width + left : left}
        y1={up ? top : top + height}
        x2={right ? left : left + width}
        y2={up ? height + top : top}
        style={{ stroke: '#286090', strokeWidth: '5', zIndex: 10 }}
      />
    )
  }

  return(
    <path
      data-tip data-for={'operator' + i}  data-event-off='mouseDown'
      id={i}
      key ={i}
      d={'M' + (left + startX) + ',' + (top + startY) + ' c'+
          cornerTop + ',' + 0 + ' ' + cornerDown + ',' + h + ' ' + w + ',' + h}
      style={{ fill: 'none', stroke: '#286090', strokeWidth: 5, zIndex: 10 }}
    />
  )
}



const RenderOperators =  ({operators, rightMostPosition, onClickOperator, clickedOperator, listAvailableOperators,
                            planes, graphId, editorMode}) => {
  return (
      <g width={rightMostPosition} height={graphSize}  style={{position: 'absolute', zIndex: 0}}>
        {operators.map( (operator, i) => {
          let scroll = $('#' + graphId + 'inner_graph').scrollLeft()
          let tsp = getHeight(operator.from.plane, planes)
          let ttp = getHeight(operator.to.plane, planes)
          let lsp = computeLeftPositionFromGraph('#source' + graphId + operator.from._id, graphId)
          let ltp = computeLeftPositionFromGraph('#target' + graphId + operator.to._id, graphId)
          let top = Math.min(tsp, ttp)
          let left = Math.min(lsp, ltp)
          let width = Math.abs(ltp-lsp)
          let height = Math.abs(tsp -ttp)
          let goUp = (top == ttp)
          let goRight = (left == lsp)
          return (
            <g key={'op'+i} width={Math.max(width, 5)}
                            height={Math.max(height, 5)}
                            x={top} y={left + scroll}
                            style={{ zIndex: 0, position: 'absolute'}}
                            onClick={
                              (event) => editorMode ? onClickOperator(event, operator, left+width/2 + scroll, top+height/2)
                                                    : null}>
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

const DrawToolTip = ( {operators, activities, scale}) => {
  return(
    <span>
      {operators.map( (operator, i) => {
        return <ReactTooltip key={'optip' + i} id={'operator' + i} type='light' style={{ position: 'absolute', zIndex: 10}}>
          Operator
          <pre>{
            JSON.stringify({'operatorType': operator.operatorType, 'type': operator.type, 'data': operator.data}, null, 2)
          }</pre>
        </ReactTooltip>
      })}
      {activities.map( (activity, i) => {
        console.log(activity.activityType)
        return <ReactTooltip
          key={'actip' + i}
          id={'tip'+activity._id}
          place='bottom'
          type='light'>
          Activity: {activity._id}
          <pre>{
            //dividing by horizontalZoom since we only want the conversion seconds -> unit
            JSON.stringify({'Data': activity.data, 'Activity Type': activity.activityType, 'Beginning': convertTimeToPx(scale, activity.position.x)/horizontalZoom + ' ' + scale}, null, 2)
          }</pre>
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
        <div data-tip data-for='dragac_tip' data-event-off='mouseDown'
            style={divStyleNeg(activity)}>
          {activity.data.name}
          <ReactTooltip
            id='dragac_tip'
            type='light'
            effect='solid'>
            <pre>{JSON.stringify(activity.data, null, 2)}</pre>
          </ReactTooltip>
        </div>
    </Draggable>
  )
}


const BoxAc = ( {onHoverStart, hoverStop, plane, activity} ) => {

  return(
    <div
      id={'box' + activity._id}
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
          plane={i%3 +1} /> //TODO to be changed with the real plane
        })}
      </div>

    </div>

  )
}

const TempAc = ({handleDragStop, position, plane, current}) => {
  return (
    <div id='dragac' style={{ position: 'absolute', zIndex: 2}} onMouseUp={(event) => handleDragStop(event, plane, current)}>
      {current ?
      <div  style={{ position: 'absolute'}}>
        <DragAc
          activity={current}
          plane={plane}
          position={position}
        />
      </div>
    : '' }
    </div>
  )
}


export const RenderGraph = ( {
  editorMode,
  activities,
  sizes,
  operators,
  onClickOperator,
  clickedOperator,
  listAvailableOperators,
  deleteAc,
  handleStop,
  sourceOperator,
  targetOperator,
  loaded,
  plane,
  graphId,
  moveCursor,
  cursor,
  scale,
  activitySourceClicked}) => {
  const rightMostPosition = getRightMostPosition(activities, scale)
  return(

      <div id={graphId + 'inner_graph'} style={divStyle}>
        <div style={{ position:'relative'}}>
            <div style={{ position: 'absolute', zIndex: 0}}>
              <svg xmlns='http://www.w3.org/2000/svg'
                  style={{ position: 'absolute', zIndex: 0}} width={rightMostPosition} height = {graphSize}>
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
              : ''}
              </svg>

              <div style={{ position:'relative'}}>
                {activities.map( (activity, i) => {
                  return (<DraggableAc
                    activity={activity}
                    editorMode={editorMode}
                    plane={activity.plane}
                    key={activity._id}
                    defaultPosition={activity.position}
                    arrayIndex={i}
                    handleStop={handleStop}
                    delete = {deleteAc}
                    sourceOperator = {sourceOperator}
                    targetOperator = {targetOperator}
                    isSourceClicked = {activitySourceClicked == activity ? true : false}
                    graphId = {graphId}
                    moveCursor={moveCursor}
                    scale={scales[scale]}
                    />)
                })}
              </div>
            </div>
          {
            clickedOperator ? listAvailableOperators() : ''
          }
            </div>
          {loaded ?
            <DrawToolTip operators={operators} activities={activities} scale={scales[scale]}/>
          : ''}
        <div>
          <AxisDisplay rightMostPosition = {rightMostPosition} graphId={graphId} cursor={cursor} scale={scales[scale]}/>
        </div>
      </div>

    );
}

export const scaleButton = (changeScale, minScale) => {
  return(
      <div onChange={changeScale}>
        <select name='scale' defaultValue={minScale}>
          {
            scales.map((scale, i) =>
                i >= minScale ? <option key={i} value={i}>{scale}</option> : ''
            )
          }
        </select>
      </div>
  );
}

const getRightMostPosition = (activities, scale) => {
    let rightMostPosition = 0
    if (activities.length > 0) {
      let mappedPosition = activities.map((activity) => {return activity.position.x + activity.data.duration})
      rightMostPosition = convertTimeToPx(scales[scale], Math.max(...mappedPosition) || 0)
    }


    return (rightMostPosition >= 1000) ? rightMostPosition + 100 : 1100;
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
    this.state = {
      currentDraggable: null,
      currentPlane: 0,
      defPos: {x: 0, y:0},
      hoverBoxPosition: {x: 0, y:0},
      currentSource: null,
      loaded: false,
      dragged: false,
      clickedOperator: null,
      clickedOperatorPosition: null,
      plane: {plane1: 0, plane2: 0, plane3: 0},
      cursor:-1,
      scale:0,
      minScale: 0,
    };
  }

  componentDidMount() {
    let {graphId} = this.props
    withPrefixId = this.props.editorMode ? graphId : 'repo' + graphId
    let plane1 = computeTopPositionFromGraph('#' + withPrefixId + 'line1', withPrefixId)
    let plane2 = computeTopPositionFromGraph('#' + withPrefixId + 'line2', withPrefixId)
    let plane3 = computeTopPositionFromGraph('#' + withPrefixId + 'line3', withPrefixId)
    this.setState({loaded: true, plane: {plane1: plane1, plane2:plane2, plane3:plane3}})
    this.props.handleLoaded()
  }

  componentWillReceiveProps(nextProps) {
    let minScale = 0;
    while(getRightMostPosition(nextProps.addedActivities, minScale) > 2000 && minScale < scales.length) {
      minScale += 1
    }

    const newScale = this.state.scale < minScale ? minScale : this.state.scale

    this.setState({
      loaded: nextProps.loaded,
      scale: newScale,
      minScale: minScale
    })
  }

  /*
   * Calling a render (to draw correctly the operators and the tooltips) when:
   * - we are swapping for a new/other graph
   * - rescaling the graph
   * - a new activity/operator is inserted
   * - an activity is dragged/resized
   */
  componentDidUpdate(prevProps, prevState) {
    if (!prevState.loaded || prevState.scale != this.state.scale
      || this.props.addedActivities.length != prevProps.addedActivities.length
      || this.props.addedOperators.length != prevProps.addedOperators.length
      || prevState.dragged
    ) {
      this.setState({loaded: true, dragged: false})
      this.props.handleLoaded()
    }
  }

  handleHover = (event, plane, activity) => {
    event.preventDefault();
    let position = $('#box' + activity._id).position()

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
    removeGraphOperatorsLinkedToActivity(activity._id)
    removeGraphActivity(activity._id)
  }


  handleDragStop = (event, plane, activity) => {
    event.preventDefault();
    let {graphId} = this.props

    const top = $('#' + graphId + 'inner_graph').offset().top
    const down = top + $('#' + graphId + 'inner_graph').height();
    const posY = event.clientY + window.scrollY;

    //If we are within the bounds
    if (down > posY && posY > top) {
      //We clone the activity for the draggable element
      let newActivity = clone(activity, true);
      newActivity._id = uuid();

      const defaultTime = 60;
      newActivity.data.duration = newActivity.data.duration ? newActivity.data.duration : defaultTime;

      //We obtain the components to set its location in the graph (relative)
      const innerGraphScrollX =  $('#' + graphId + 'inner_graph').scrollLeft() -
                                  $('#' + graphId + 'inner_graph').position().left;
      const newY = computeTopPositionFromGraph('#' + graphId + 'plane' + plane, graphId) - 20;
      //20 is a constant so that the component is not put under the line but on the line
      let newX = Math.max(event.clientX + window.scrollX + innerGraphScrollX - textSizeAndMargin, 0)
      const remaining = newX % interval
      newX =  2*remaining>interval ? Math.round(newX + interval - remaining) : Math.round(newX - remaining)
      let newPosition = {x: convertPxToTime(scales[this.state.scale], newX), y: newY};
      this.setState({loaded:false})
      addGraphActivity({ _id: newActivity._id, graphId: this.props.graphId, activityType: newActivity.activityType,
                          position: newPosition, data: newActivity.data, plane: plane}, newActivity._id)
    }
    this.setState({currentDraggable: null});
  }

  handleStop = (arrayIndex, position) => {
    dragGraphActivitySet(this.props.addedActivities[arrayIndex]._id, position)
    this.setState({loaded: false, dragged: true})
  }

  sourceClicked = (source) => {
    if (source === this.state.currentSource) {
      this.setState({currentSource:null});
    }
    else {
      this.setState({currentSource:source});
    }
  }

  addNewOperator = (target) => {
    if (this.state.currentSource != null && target != this.state.currentSource) {
      this.setState({currentSource:null, loaded:false});
      const fromAc = {plane: this.state.currentSource.plane, _id: this.state.currentSource._id}
      const toAc = {plane: target.plane, _id: target._id}
      addGraphOperator({_id: uuid(), graphId: this.props.graphId, from: fromAc, to:toAc})
    }
  }

  clickedOperator = (event, operator, x, y) => {
    event.preventDefault();
    if (this.state.clickedOperator != operator) {
      this.setState({clickedOperator:operator, clickedOperatorPosition:{x: x, y:y}})
    }
  }

  //dragged is used only on ResizeStop to redraw the operator correctly
  moveCursor = (newPosition, dragged = false) => {
    this.setState({cursor:newPosition, dragged: dragged})
  }

  operatorChosen = (event) => {
    event.preventDefault();
    if (event.target.value > -1) {
      const chosenOperator = this.props.operators[event.target.value];
      this.state.clickedOperator.operatorType = chosenOperator.operatorType;
      this.state.clickedOperator.type = chosenOperator.type;
      this.state.clickedOperator.data = chosenOperator.data;
      modifyGraphOperator(this.state.clickedOperator._id, chosenOperator.operatorType,
                          chosenOperator.type, chosenOperator.data)
    }
    else {
      removeGraphOperator(this.state.clickedOperator._id)
    }
    this.setState({clickedOperator:null, clickedOperatorPosition:null})
  }

  listAvailableOperators = () => {
    return (
      <div style={{ position:'absolute', left:this.state.clickedOperatorPosition.x, top:this.state.clickedOperatorPosition.y}}>
        <div style={{ position:'relative', left:'-50%', top:'-50%'}}>
          <select id='operators' size='4' onChange={(event) => this.operatorChosen(event)}>
            {
              this.props.operators.length == 0 ? <option disabled>No operator to choose</option> : ''
            }
            <option key={'cancel'} value={-1} style={{ textAlign:'center'}}>Cancel</option>
            {
              this.props.operators.map((operator, i) => {
                return <option key={'choice'+i} value={i} style={{ textAlign:'center'}}>
                          {operator.operatorType}
                       </option>
              })
            }
            <option key={'delete'} value={-2} style={{ textAlign:'center'}}>Delete</option>
          </select>
        </div>
      </div>
    )
  }

  changeScale = (event) => {
    this.setState({scale:event.target.value, loaded:false})
    scrollGraph(0, this.props.graphId)
  }

  render() {
    let {editorMode} = this.props
    return (
      <div id='graph-summary' >
          <br />
          {scaleButton(this.changeScale, this.state.minScale)}
          <RenderGraph
            id = 'planes'
            editorMode={editorMode}
            activities={this.props.addedActivities}
            operators={this.props.addedOperators}
            onClickOperator={editorMode ? this.clickedOperator : undefined}
            clickedOperator={editorMode ? this.state.clickedOperator : undefined}
            listAvailableOperators={editorMode ? this.listAvailableOperators: undefined}
            deleteAc={this.deleteInGraphAc}
            handleStop={editorMode ? this.handleStop : undefined}
            sourceOperator = {editorMode ? this.sourceClicked : undefined}
            targetOperator = {this.addNewOperator}
            activitySourceClicked = {this.state.currentSource}
            loaded={this.state.loaded}
            plane={this.state.plane}
            graphId={editorMode ? this.props.graphId : 'repo' + this.props.graphId}
            moveCursor={this.moveCursor}
            cursor={this.state.cursor}
            scale={this.state.scale}
            />
          <br/>
          <br/>
          {editorMode ?

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
           : ''}

      </div>
    );
  }
}


Graph.propTypes = {
  activities: PropTypes.array.isRequired,
  operators: PropTypes.array.isRequired,
  graphId: PropTypes.string.isRequired,
};

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
  position: 'static',
  zIndex: 0,
  display:'inline-block',
  width: '100%',
  overflowX: 'scroll',
  overflowY: 'hidden',
  border: 1,
  borderStyle: 'solid',
  borderColor: 'white',
  background: '#ffffff'
}

const divListStyle = {
  position: 'relative',
  display:'inline-block',
  width: '100%',
  border: 1,
  borderStyle: 'solid',
  borderColor: 'white',
  background: 'white',
}

const divListStyleNoActivity = {
  position: 'relative',
  display:'inline-block',
  width: '100%',
  border: 1,
  textAlign:'center',
  borderStyle: 'solid',
  borderColor: 'white',
  background: 'white',
}
//#b62020 dark red
const divStyleNeg = (activity) => { return {

  background: 'white',
  borderRadius: 4,
  border: 2,
  width: $('#box' + activity._id).outerWidth(),
  height: $('#box' + activity._id).outerHeight(),
  margin: 10,
  padding: 10,
  float: 'left',
  position: 'absolute',
  borderStyle: 'solid',
  color: '#286090',
  borderColor: '#286090'
  }
}

const divStyleAc = () => { return {
  background: 'white',
  borderRadius: 4,
  border: 2,
  height: 40,
  margin: 10,
  padding: 10,
  float: 'left',
  position: 'relative',
  borderStyle: 'solid',
  borderColor: 'grey'
  }
}
