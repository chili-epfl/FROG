// @flow

import * as React from 'react';
import { DraggableCore } from 'react-draggable';

import { connect, store, type StoreProp } from '../store';
import { timeToPx, rangeExclusive } from '../utils';

export const PanMap = connect(
  ({
    store: {
      ui: { panx, panDelta, scale, graphWidth }
    }
  }: StoreProp) => (
    <DraggableCore onDrag={(_, { deltaX }) => panDelta(deltaX)}>
      <rect
        x={1 + panx}
        y={1}
        fill="transparent"
        stroke="black"
        strokeWidth={2}
        rx={10}
        width={graphWidth / scale - 2}
        height={148}
      />
    </DraggableCore>
  )
);

const onDoubleClick = (x, e) => {
  store.activityStore.addActivity(x, e.nativeEvent.offsetX - 10, e.shiftKey);
};

export const LevelLines = connect(
  ({
    store: {
      ui: { scale, graphWidth }
    },
    scaled
  }: StoreProp & { scaled: boolean }) => (
    <g>
      {[1, 2, 3].map(plane => (
        <g key={plane}>
          <text x="5" y={plane * (350 / 4) - 10} fill="#8698AB">
            {['Class', 'Group', 'Individual'][plane - 1]}
          </text>
          <line
            x1={0}
            y1={plane * (350 / 4)}
            x2={graphWidth * (scaled ? scale : 4)}
            y2={plane * (350 / 4)}
            stroke="#8698AB"
            strokeWidth={5 - plane === 1 ? 2 : 1}
            strokeDasharray={5 - plane === 1 ? '10,10' : '5,5'}
          />
          <rect
            onDoubleClick={e => onDoubleClick(plane, e)}
            x={0}
            y={plane * (350 / 4) - 14}
            width={graphWidth * (scaled ? scale : 4)}
            fill="transparent"
            height={28}
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
    let divider = Math.round((5 / scale) * (graphDuration / 120)) * 5;
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
                <line
                  x1={x}
                  y1={350 - length}
                  x2={x}
                  y2={350}
                  stroke="#8698AB"
                />
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
