// @flow

import * as React from 'react';

import { connect, store, type StoreProp } from './store';
import Activities from './Activities';
import Operators from './Operators';

import Lines, { DragLine } from './components/Lines';
import { LevelLines, PanMap } from './components/fixedComponents';
import ScrollFields from './components/ScrollFields';
import ProgressLines from './components/ProgressLines';
// import { ErrorList } from './Validator';

const scrollMouse = e => {
  e.preventDefault();
  if (e.shiftKey) {
    store.ui.setScaleDelta(e.deltaY);
  } else {
    store.ui.panDelta(e.deltaY);
  }
};

const mousemove = e => {
  // Subtracting Graph Editor's position from the top of the screen
  store.ui.socialMove(e.clientX, e.clientY - (window.innerHeight - 300 - 100));
};

const Graph = connect(
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
    hideOperatorsAndConnections
  }: StoreProp & {
    scaled: boolean,
    isSvg: boolean,
    isEditable: boolean,
    isSession: boolean,
    hasPanMap: boolean,
    hideOperatorsAndConnections: boolean
  }) => (
    <svg
      width="100%"
      height="100%"
      onMouseMove={mousemove}
      onWheel={scrollMouse}
      fill="#3E4A57"
    >
      <svg
        viewBox={
          scaled
            ? [panOffset, 0, graphWidth, 300].join(' ')
            : [0, 0, 4 * graphWidth, 300].join(' ')
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
          fill="#EAF1F8"
          stroke="transparent"
          width={scaled ? graphWidth * scale : graphWidth * 4}
          height="300px"
          onClick={canvasClick}
        />
        <LevelLines scaled={scaled} />
        {!hideOperatorsAndConnections && <Lines scaled={scaled} />}
        <Activities scaled={scaled} />
        {!hideOperatorsAndConnections && <Operators scaled={scaled} />}
        {isSession && <ProgressLines scaled={scaled} />}
        {isEditable && scrollEnabled && <DragLine />}
        <Activities scaled={scaled} transparent />
        {!hideOperatorsAndConnections && (
          <Operators scaled={scaled} transparent />
        )}
      </svg>
      {hasPanMap && <PanMap />}
      {scaled && scrollEnabled && (
        <ScrollFields width={graphWidth} height={600} />
      )}
      {/* {!hasPanMap && <ErrorList />} */}
    </svg>
  )
);

Graph.displayName = 'GraphContainer';
export default Graph;
