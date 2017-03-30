// @flow

import React from 'react';
import svg2pdf from 'svg2pdf.js';
import jsPDF from 'jspdf-yworks';

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

const download = () => {
  const pdf = new jsPDF('l', 'pt', [width, height]);

  // render the svg element
  svg2pdf(store.ui.svgRef, pdf, {
    xOffset: 0,
    yOffset: 0,
    scale: 1
  });

  // get the data URI
  const uri = pdf.output('datauristring');
  const link = document.createElement('a');
  link.href = 'data:,' + uri;
  link.click();
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
  hasPanMap,
  viewBox
}: StoreProp & {
  width: number,
  height: number,
  hasPanMap: boolean,
  viewBox: string
}) => (
  <svg
    width={graphWidth}
    height={height}
    onMouseMove={mousemove}
    onWheel={scrollMouse}
    onClick={canvasClick}
    ref={ref => {
      if (!hasPanMap) {
        setSvgRef(ref);
      }
    }}
  >
    <svg viewBox={viewBox}>
      <rect
        x={0}
        y={0}
        fill="#fcf9e9"
        stroke="transparent"
        rx={10}
        width={hasPanMap ? 4 * graphWidth : graphWidth * scale}
        height={hasPanMap ? 4 * height : height}
      />
      <LevelLines hasPanMap={hasPanMap} />
      {!hasPanMap &&
        <g>
          <DragGuides />
          <TimeScale />
        </g>}
      <Lines scaled={!hasPanMap} />
      <Activities scaled={!hasPanMap} />
      {!hasPanMap && scrollEnabled && <DragLine />}
      <Operators scaled={!hasPanMap} />
    </svg>
    {!!hasPanMap && <PanMap />}
    {!hasPanMap &&
      scrollEnabled &&
      <ScrollFields width={width} height={height} />}
  </svg>
));
