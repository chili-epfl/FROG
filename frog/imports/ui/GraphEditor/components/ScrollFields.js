// @flow

import * as React from 'react';

import { connect, store, type StoreProp } from './../store';

const scrollInterval = direction => {
  if (!store.scrollIntervalID) {
    store.ui.storeInterval(
      window.setInterval(() => store.ui.panDelta(3 * direction), 20)
    );
  }
};

const ScrollField = connect(
  ({
    x,
    height,
    direction,
    store: { ui: { cancelScroll, panx, graphWidth } }
  }: StoreProp & { x: number, height: number, direction: number }) => {
    if (
      (direction === -1 && panx > 0) ||
      (direction === 1 && panx < graphWidth - 15)
    ) {
      return (
        <rect
          onMouseEnter={() => scrollInterval(direction)}
          onMouseOut={cancelScroll}
          fill="#999955"
          fillOpacity="0.2"
          stroke="transparent"
          x={x}
          y={0}
          width={50}
          height={height}
          style={{ cursor: 'ew-resize' }}
        />
      );
    } else {
      return null;
    }
  }
);

export default ({ width, height }: { width: number, height: number }) => (
  <g>
    <ScrollField x={0} height={height} direction={-1} />
    <ScrollField x={width - 50} height={height} direction={1} />
  </g>
);
