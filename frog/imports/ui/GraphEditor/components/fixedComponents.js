// @flow

import * as React from 'react';
import { DraggableCore } from 'react-draggable';

import { connect, store, type StoreProp } from './../store';
import { timeToPx, rangeExclusive } from './../utils';

export const PanMap = connect(
  ({
    store: {
      ui: { panx, panDelta, scale, graphWidth }
    }
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
  )
);

const onDoubleClick = (x, e) => {
  store.activityStore.addActivity(x, e.nativeEvent.offsetX, e.shiftKey);
};

export const LevelLines = connect(
  ({
    store: {
      ui: { scale, graphWidth }
    },
    scaled
  }: StoreProp & { scaled: boolean }) => (
    <g>
      {[1, 2, 3, 4].map(x => (
        <g key={x}>
          <line
            x1={0}
            y1={x * 100 + 65}
            x2={graphWidth * (scaled ? scale : 4)}
            y2={x * 100 + 65}
            stroke="grey"
            strokeWidth={x === 1 ? 2 : 1}
            strokeDasharray={x === 1 ? '10,10' : '5,5'}
          />
          <rect
            onDoubleClick={e => onDoubleClick(5 - x, e)}
            x={0}
            y={x * 100 + 45}
            width={graphWidth * (scaled ? scale : 4)}
            fill="transparent"
            height={40}
          />
        </g>
      ))}
    </g>
  )
);

export const TimeScale = connect(
  ({
    store: {
      ui: { scale },
      graphDuration
    },
    scaled
  }) => {
    let divider = Math.round(5 / scale * (graphDuration / 120)) * 5;
    divider = divider || 1;
    return (
      <g>
        {rangeExclusive(1, graphDuration).map(i => {
          const scaleBy = scaled ? scale : 4;
          const x = timeToPx(i, scaleBy);
          const length = i % divider === 0 ? 15 : 5;
          return (
            <g key={i}>
              {divider < 20 || i % 5 === 0 ? (
                <line x1={x} y1={600 - length} x2={x} y2={600} stroke="grey" />
              ) : null}
              {i % divider === 0 ? (
                <text x={x - 15} y={540}>
                  {i + ' min.'}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
    );
  }
);
