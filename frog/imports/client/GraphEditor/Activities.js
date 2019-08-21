// @flow
import React, { Component } from 'react';
import { DraggableCore } from 'react-draggable';
import { connect, type StoreProp, store } from './store';
import Activity from './store/activity';
import { getClickHandler } from './utils';

const Box = ({ x, y, width, selected, strokeColor, color }) => (
  <g>
    {selected && (
      <rect
        x={x - 1}
        y={y - 1}
        width={width + 2}
        stroke="#B7E2DD"
        strokeWidth={3}
        rx={11}
        height={28}
      />
    )}
    <rect
      x={x}
      y={y}
      width={width}
      fill={color}
      stroke={strokeColor}
      strokeWidth={1}
      rx={10}
      height={26}
    />
  </g>
);

class ActivityComponent extends Component<Object> {
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
        activityStore: { stopMoving, startResizing, stopResizing },
        connectionStore: { startDragging, stopDragging }
      },
      activity,
      scaled
    }: StoreProp & { activity: Activity, scaled: Boolean } = this.props;
    const { mode } = this.props.store.state;
    const x = scaled ? activity.xScaled : activity.x;
    const width = scaled ? activity.widthScaled : activity.width;
    const readOnly = mode === 'readOnly';
    if (this.props.transparent) {
      return (
        <g onClick={e => e.stopPropagation()} onMouseUp={this.clickHandler}>
          <DraggableCore
            onDrag={e => {
              activity.move(e.shiftKey);
            }}
            onStop={stopMoving}
          >
            <rect
              data-tip={activity.title}
              x={x}
              y={activity.y}
              fill="transparent"
              stroke="transparent"
              width={width > 20 ? width - 20 : width}
              height={25}
              style={!readOnly && { cursor: 'move' }}
              onMouseOver={activity.onOver}
              onMouseLeave={activity.onLeave}
            />
          </DraggableCore>
        </g>
      );
    }
    return (
      <g>
        <Box
          x={x}
          y={activity.y}
          width={width}
          highlighted={activity.color}
          selected={activity.selected}
          color={activity.color}
          strokeColor={activity.strokeColor}
        />
        {width > 21 && (
          <g>
            <svg
              data-tip={activity.title}
              style={{ overflow: 'hidden' }}
              width={width + x - 20}
            >
              <text x={x + 10} y={activity.y + 18} font-size="15">
                {activity.title}
              </text>
            </svg>
            <circle
              data-tip={activity.title}
              cx={x + width - 14}
              cy={activity.y + 12}
              r={4}
              fill="#CDDEEF"
              stroke="transparent"
            />
            <DraggableCore
              onStart={() => startDragging(activity)}
              onStop={stopDragging}
            >
              <circle
                data-tip={activity.title}
                cx={x + width - 10}
                cy={activity.y + 5}
                r={10}
                fill="transparent"
                stroke="transparent"
                style={!readOnly && { cursor: 'crosshair' }}
              />
            </DraggableCore>
            <DraggableCore
              onStart={() => startResizing(activity)}
              onDrag={e => activity.resize(e.shiftKey)}
              onStop={stopResizing}
            >
              <rect
                data-tip={activity.title}
                fill="transparent"
                stroke="transparent"
                x={x + width - 5}
                y={activity.y}
                width={5}
                height={25}
                style={!readOnly && { cursor: 'ew-resize' }}
              />
            </DraggableCore>
          </g>
        )}
      </g>
    );
  }
}

const ActivityBox = connect(ActivityComponent);

export default connect(
  ({
    store: {
      activityStore: { all }
    },
    scaled,
    transparent
  }: StoreProp & { scaled: boolean, transparent: boolean }) => (
    <g>
      {all.map(x => (
        <ActivityBox
          activity={x}
          transparent={transparent}
          scaled={scaled}
          key={x.id}
        />
      ))}
    </g>
  )
);
