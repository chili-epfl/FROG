// @flow
import React, { Component } from 'react';
import { DraggableCore } from 'react-draggable';
import { connect, type StoreProp, store } from './store';
import Activity from './store/activity';
import { getClickHandler } from './utils';

const Box = ({ x, y, width, selected, strokeColor, color }) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      fill={color}
      stroke={strokeColor}
      rx={10}
      height={30}
    />;
    {selected && (
      <rect
        x={x - 2}
        y={y - 2}
        width={width + 2}
        stroke="#ff9900"
        fill="transparent"
        rx={10}
        height={34}
      />
    )}
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
            onDrag={(e, { deltaX }) => {
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
              height={30}
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
              <text x={x + 3} y={activity.y + 20}>
                {activity.title}
              </text>
            </svg>
            <circle
              data-tip={activity.title}
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
                data-tip={activity.title}
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
                height={30}
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
