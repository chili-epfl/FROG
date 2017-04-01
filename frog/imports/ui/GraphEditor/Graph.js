// @flow

import React from 'react';

import Lines, { DragLine } from './Lines';
import Activities from './Activities';
import { LevelLines, PanMap, TimeScale } from './fixedComponents';
import ScrollFields from './ScrollFields';
import DragGuides from './DragGuides';
import { connect, store, type StoreProp } from './store';
import Operators from './Operators';

const scrollMouse = e => {
  e.preventDefault();
  if (e.shiftKey) {
    store.ui.setScaleDelta(e.deltaY);
  } else {
    store.ui.panDelta(e.deltaY);
  }
};

const mousemove = e => {
  store.ui.socialMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
};

export default connect(({
  store: {
    ui: {
      scale,
      scrollEnabled,
      canvasClick,
      graphWidth,
      setSvgRef
    }
  },
  width,
  height,
  scaled,
  viewBox,
  isSvg
}: StoreProp & {
  width: number,
  height: number,
  scaled: boolean,
  viewBox: string,
  isSvg: Boolean
}) => (
  <svg
    width={graphWidth}
    height={height}
    onMouseMove={mousemove}
    onWheel={scrollMouse}
    onClick={canvasClick}
  >
    <svg
      viewBox={viewBox}
      ref={ref => {
        if (isSvg) {
          setSvgRef(ref);
        }
      }}
    >
      <rect
        x={0}
        y={0}
        fill="#fcf9e9"
        stroke="transparent"
        rx={10}
        width={scaled ? graphWidth * scale : graphWidth * 4}
        height={scaled ? height : height * 4}
      />
      <LevelLines scaled={scaled} />
      {scaled &&
        <g>
          <DragGuides />
        </g>}
      {(scaled || isSvg) && <TimeScale />}
      <Lines scaled={scaled} />
      <Activities scaled={scaled} />
      {scaled && scrollEnabled && <DragLine />}
      <Operators scaled={scaled} />
    </svg>
    {!scaled && <PanMap />}
    {scaled && scrollEnabled && <ScrollFields width={width} height={height} />}
  </svg>
));
