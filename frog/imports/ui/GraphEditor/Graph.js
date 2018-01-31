// @flow

import React from 'react';

import { connect, store, type StoreProp } from './store';
import Activities from './Activities';
import Operators from './Operators';

import Lines, { DragLine } from './components/Lines';
import { LevelLines, PanMap, TimeScale } from './components/fixedComponents';
import ScrollFields from './components/ScrollFields';
import DragGuides from './components/DragGuides';
import ProgressLines from './components/ProgressLines';
import { ErrorList } from './Validator';

const scrollMouse = e => {
  e.preventDefault();
  if (e.shiftKey) {
    store.ui.setScaleDelta(e.deltaY);
  } else {
    store.ui.panDelta(e.deltaY);
  }
};

const mousemove = e => {
  store.ui.socialMove(e.clientX, e.clientY);
};

export default connect(
  ({
    store: {
      ui: {
        scale,
        scrollEnabled,
        canvasClick,
        graphWidth,
        panOffset,
        setSvgRef
      }
    },
    scaled,
    isSvg,
    isEditable,
    isSession,
    hasPanMap,
    hasTimescale
  }: StoreProp & {
    scaled: boolean,
    isSvg: boolean,
    isEditable: boolean,
    isSession: boolean,
    hasPanMap: boolean,
    hasTimescale: boolean
  }) => (
    <svg
      width="100%"
      height="100%"
      onMouseMove={mousemove}
      onWheel={scrollMouse}
    >
      <svg
        viewBox={
          scaled
            ? [panOffset, 0, graphWidth, 600].join(' ')
            : [0, 0, 4 * graphWidth, 600].join(' ')
        }
        preserveAspectRatio="none"
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
        <Lines scaled={scaled} />
        <Activities scaled={scaled} />
        <Operators scaled={scaled} />
        {isSession && <ProgressLines scaled={scaled} />}
        {isEditable && <DragGuides />}
        {hasTimescale && <TimeScale scaled={scaled} />}
        {isEditable && scrollEnabled && <DragLine />}
        <Activities scaled={scaled} transparent />
        <Operators scaled={scaled} transparent />
      </svg>
      {hasPanMap && <PanMap />}
      {scaled &&
        scrollEnabled && <ScrollFields width={graphWidth} height={600} />}
      {!hasPanMap && <ErrorList />}
    </svg>
  )
);
