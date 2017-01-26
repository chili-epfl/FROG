import React from "react";
import Lines, { DragLine } from "./Lines";
import Activities from "./Activities";
import { LevelLines, PanMap, TimeScale } from "./fixed_components";
import ScrollFields from "./ScrollFields";
import DragGuides from "./DragGuides";
import { connect, store } from "./store";
import Operators from './Operators'

const scrollMouse = e => {
  e.preventDefault();
  if (e.shiftKey) {
    store.setScale(store.scale + e.deltaY * 0.01);
  } else {
    store.panDelta(e.deltaY);
  }
};


const mousemove = e => {
  store.socialMove(e.clientX, e.clientY) 
}

export default connect((
  {
    store: { mode, scale, scrollEnabled, canvasClick, socialCoords },
    width,
    height,
    hasPanMap,
    viewBox,
    scaleFactor = 1
  }
) => (
  <svg width={width} height={height} onMouseMove={mousemove} onWheel={scrollMouse} onClick={canvasClick}>
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
      {!hasPanMap && (
            <g>
              <DragGuides />
              <TimeScale />
            </g>
          )}
      <Operators scaled={!hasPanMap} />
    </svg>
    {!!hasPanMap && <PanMap />}
    {
      !hasPanMap &&
        scrollEnabled &&
        <ScrollFields width={width} height={height} />
    }
  </svg>
));
