// @flow
import React from 'react';
import Lines, { DragLine } from './Lines';
import Activities from './Activities';
import { LevelLines, PanMap, TimeScale } from './fixed_components';
import ScrollFields from './ScrollFields';
import DragGuides from './DragGuides';
import { connect, store, type StoreProp } from './store';
import Operators from './Operators';

const scrollMouse = e => {
  e.preventDefault();
  if (e.shiftKey) {
    store.ui.setScaleDelta(e.deltaY * 0.01);
  } else {
    store.ui.panDelta(e.deltaY);
  }
};

const mousemove = e => {
  store.ui.socialMove(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
};

export default connect((
  {
    store: {
      ui: {
        scale,
        scrollEnabled,
        canvasClick,
        setOverGraph
      }
    },
    width,
    height,
    hasPanMap,
    viewBox
  }:
    & StoreProp
    & { width: number, height: number, hasPanMap: boolean, viewBox: string }
) => (
  <svg
    width={width}
    height={height}
    onMouseMove={mousemove}
    onMouseOver={() => !hasPanMap && setOverGraph(true)}
    onMouseLeave={() => !hasPanMap && setOverGraph(false)}
    onWheel={scrollMouse}
    onClick={canvasClick}
  >
    <svg viewBox={viewBox}>
      <rect
        x={0}
        y={0}
        fill="#fcf9e9"
        stroke="transparent"
        rx={10}
        width={hasPanMap ? 4000 : width * 4 * scale}
        height={height * 4}
      />
      <LevelLines />
      <Lines scaled={!hasPanMap} />
      <Activities scaled={!hasPanMap} />
      {!hasPanMap && scrollEnabled && <DragLine />}
      {!hasPanMap &&
        <g>
          <DragGuides />
          <TimeScale />
        </g>}
      <Operators scaled={!hasPanMap} />
    </svg>
    {!!hasPanMap && <PanMap />}
    {!hasPanMap &&
      scrollEnabled &&
      <ScrollFields width={width} height={height} />}
  </svg>
));

const keyDown = e => {
  console.log(e);
  if (store.mode === 'rename') {
    return;
  }
  if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey) {
    return;
  }
  if (e.keyCode === 27) {
    // esc
    store.ui.cancelAll();
    store.ui.unselect();
  }
  if (e.keyCode === 8) {
    // backspace
    store.deleteSelected();
  }
  if (e.keyCode === 83) {
    // s - social operator
    store.operatorStore.place('social');
  }
  if (e.keyCode === 80) {
    // p - product operator
    store.operatorStore.place('product');
  }
};
