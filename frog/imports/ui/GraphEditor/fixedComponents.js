// @flow

import React from 'react';
import { DraggableCore } from 'react-draggable';

import { connect, store, type StoreProp } from './store';
import { timeToPx } from './utils';

export const PanMap = connect(({
  store: { ui: { panx, panDelta, scale, graphWidth } }
}: StoreProp) => (
  <DraggableCore onDrag={(_, { deltaX }) => panDelta(deltaX)}>
    <rect
      x={panx}
      y={0}
      fill="transparent"
      stroke="black"
      strokeWidth={4}
      rx={10}
      width={graphWidth / scale}
      height={150}
    />
  </DraggableCore>
));

const onDoubleClick = (x, e) => {
  store.activityStore.addActivity(x, e.nativeEvent.offsetX);
};

export const LevelLines = connect(({
  store: { ui: { scale, graphWidth } },
  hasPanMap
}: StoreProp & { hasPanMap: boolean }) => (
  <g>
    {[1, 2, 3].map(x => (
      <g key={x}>
        <line
          x1={0}
          y1={x * 100 + 65}
          x2={graphWidth * (hasPanMap ? 4 : scale)}
          y2={x * 100 + 65}
          stroke="grey"
          strokeWidth={1}
          strokeDasharray="5,5"
        />
        <rect
          onDoubleClick={e => onDoubleClick(x, e)}
          x={0}
          y={x * 100 + 45}
          width={graphWidth * (hasPanMap ? 4 : scale)}
          fill="transparent"
          height={40}
        />
      </g>
    ))}
  </g>
));

export const TimeScale = connect(({
  store: { ui: { scale }, graphDuration }
}) => (
  <g>
    {[...Array(graphDuration).keys()].map(index => {
      const i = index + 1;
      const boolToBit = b => b ? 1 : 0;
      const length = boolToBit(i % 15 === 0) * 15 +
        boolToBit(i % 5 === 0) * 10 +
        5;
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
