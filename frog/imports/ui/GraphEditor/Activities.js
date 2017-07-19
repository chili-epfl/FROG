// @flow
import React, { Component } from 'react';
import { DraggableCore } from 'react-draggable';
import { connect, type StoreProp, store } from './store';
import Activity from './store/activity';
import { getClickHandler } from './utils';
import { Activities, Operators, Connections } from '../../api/activities';
import valid from '../../api/validGraphFn';

const Box = ({ x, y, width, selected, color }) =>
  <rect
    x={x}
    y={y}
    width={width}
    stroke={selected ? '#ff9900' : 'grey'}
    fill={color}
    rx={10}
    height={30}
  />;

class ActivityComponent extends Component {
  clickHandler: ?Function;

  componentWillMount() {
    this.clickHandler = getClickHandler(() => {
      if (store.state.mode === 'normal' || store.state.mode === 'readOnly') {
        this.props.activity.select();
      }
    }, this.props.activity.setRename);
  }

  componentWillUnmount() {
    this.clickHandler = null;
  }

  render() {
    const {
      store: {
        state: { mode },
        activityStore: { stopMoving, startResizing, stopResizing },
        connectionStore: { startDragging, stopDragging }
      },
      activity,
      scaled
    }: StoreProp & { activity: Activity, scaled: Boolean } = this.props;
    const x = scaled ? activity.xScaled : activity.x;
    const width = scaled ? activity.widthScaled : activity.width;
    const readOnly = mode === 'readOnly';
    const valid = this.props.errs.filter( e => e.id === activity.id).length === 0;
    return (
      <g
        onMouseOver={activity.onOver}
        onMouseLeave={activity.onLeave}
        onClick={e => e.stopPropagation()}
        onMouseUp={this.clickHandler}
      >
        <Box
          x={x}
          y={activity.y}
          width={width}
          highlighted={activity.color}
          selected={activity.selected}
          color={valid ? activity.color : '#FFA0A0'}
        />
        {width > 21 &&
          <g>
            <svg style={{ overflow: 'hidden' }} width={width + x - 20}>
              <text x={x + 3} y={activity.y + 20}>
                {activity.title}
              </text>
            </svg>
            <circle
              cx={x + width - 10}
              cy={activity.y + 15}
              r={5}
              fill="transparent"
              stroke="black"
            />
            <DraggableCore
              onStart={() => startDragging(activity)}
              onStop={stopDragging}
            >
              <circle
                cx={x + width - 10}
                cy={activity.y + 15}
                r={10}
                fill="transparent"
                stroke="transparent"
                style={!readOnly && { cursor: 'crosshair' }}
              />
            </DraggableCore>
            <DraggableCore
              onStart={() => startResizing(activity)}
              onDrag={() => activity.resize()}
              onStop={stopResizing}
            >
              <rect
                fill="transparent"
                stroke="transparent"
                x={x + width - 5}
                y={activity.y}
                width={5}
                height={30}
                style={!readOnly && { cursor: 'ew-resize' }}
              />
            </DraggableCore>
          </g>}
        <DraggableCore
          onDrag={(_, { deltaX }) => activity.move(deltaX)}
          onStop={stopMoving}
        >
          <rect
            x={x}
            y={activity.y}
            fill="transparent"
            stroke="transparent"
            width={width > 20 ? width - 20 : width}
            height={30}
            style={!readOnly && { cursor: 'move' }}
          />
        </DraggableCore>
      </g>
    );
  }
}

const ActivityBox = connect(ActivityComponent);

export default connect(
  ({
    store: {graphId, activityStore: { all } },
    scaled
  }: StoreProp & { scaled: boolean }) =>{
    const acts = Activities.find({ graphId: graphId }).fetch();
    const ops = Operators.find({ graphId: graphId }).fetch();
    const cons = Connections.find({ graphId: graphId }).fetch();
    const v = valid(acts, ops, cons);
    return (<g>
      {all.map(x => <ActivityBox activity={x} scaled={scaled} key={x.id} errs={v}/>)}
    </g>);}
);
