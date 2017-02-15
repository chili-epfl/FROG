// @flow
import React from 'react';
import { DraggableCore } from 'react-draggable';
import { connect, store, type StoreProp } from './store';
import { timeToPx } from './utils';

export const PanMap = connect(({ store: { ui: {panx, panDelta, scale }}}: StoreProp) => (
  <DraggableCore onDrag={(_, { deltaX }) => panDelta(deltaX)}>
    <rect
      x={panx}
      y={0}
      fill="transparent"
      stroke="black"
      strokeWidth={4}
      rx={10}
      width={250 / scale}
      height={150}
    />
  </DraggableCore>
));

const onDoubleClick = (x, e) => {
  store.activityStore.addActivity(x, e.nativeEvent.offsetX);
};

export const LevelLines = connect(({ store: { ui: {scale }} }: StoreProp) => (
  <g>
    {[1, 2, 3].map(x => (
      <g key={x}>
        <line
          x1={0}
          y1={x * 100 + 65}
          x2={4000 * scale}
          y2={x * 100 + 65}
          stroke="grey"
          strokeWidth={1}
          strokeDasharray="5,5"
        />
        <rect
          onDoubleClick={e => onDoubleClick(x, e)}
          x={0}
          y={x * 100 + 45}
          width={4000 * scale}
          fill="transparent"
          height={40}
        />
      </g>
    ))}
  </g>
));

export const TimeScale = connect(({ store: { ui: { scale } } }) => (
  <g>
    {[...Array(120).keys()].map(index => {
      const i = index + 1;
      const length = (i % 15 === 0 ? 15 : 0) + (i % 5 === 0 ? 10 : 0) + 5;
      const x = timeToPx(i, scale);
      return (
        <g key={i}>
          <line x1={x} y1={600 - length} x2={x} y2={600} stroke="grey" />
          {i % 15 === 0 ? <text x={x - 15} y={540}>{i + ' min.'}</text> : null}
        </g>
      );
    })}
  </g>
));
