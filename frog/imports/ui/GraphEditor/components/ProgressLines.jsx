// @flow

import React from 'react';
import { connect, type StoreProp } from '../store';
import { timeToPx } from '../utils';

const ProgressLine = ({ color, x }) => (
  <line x1={x} y1={0} x2={x} y2={600} stroke={color} strokeWidth={3} />
);

export default connect(
  ({
    scaled,
    store: { ui: { scale }, session: { timeInGraph, timeInClass } }
  }: StoreProp & { scaled: Boolean }) => {
    const s = scaled ? scale : 4;
    return (
      <g>
        <ProgressLine color="red" x={timeToPx(timeInClass, s)} />
        <ProgressLine color="green" x={timeToPx(timeInGraph, s)} />
      </g>
    );
  }
);
