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
  isSvg,
  isEditable,
  hasPanMap,
  hasTimescale
}: StoreProp & {
  width: number,
  height: number,
  scaled: boolean,
  viewBox: string,
  isSvg: Boolean,
  isEditable: Boolean,
  hasPanMap: Boolean,
  hasTimescale: Boolean
}) => (
  <svg
    width="100%"
    height="100%"
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
        height={600}
        onClick={canvasClick}
      />
      <LevelLines scaled={scaled} />
      {isEditable && <DragGuides />}
      {hasTimescale && <TimeScale scaled={scaled} />}
      <Lines scaled={scaled} />
      <Activities scaled={scaled} />
      {isEditable && scrollEnabled && <DragLine />}
      <Operators scaled={scaled} />
    </svg>
    {hasPanMap && <PanMap />}
    {scaled && scrollEnabled && <ScrollFields width={width} height={height} />}
  </svg>
));
