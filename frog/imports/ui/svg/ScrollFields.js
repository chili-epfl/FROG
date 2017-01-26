import React from "react";
import { connect, store } from "./store";

const scrollInterval = direction => {
  if (!store.scrollIntervalID) {
    store.storeInterval(
      window.setInterval(() => store.panDelta(1 * direction), 20)
    );
  }
};

const ScrollField = connect((
  { x, height, direction, store: { cancelScroll } }
) => (
  <rect
    onMouseEnter={() => scrollInterval(direction)}
    onMouseOut={cancelScroll}
    fill="transparent"
    stroke="transparent"
    x={x}
    y={0}
    width={50}
    height={height}
    style={{ cursor: "ew-resize" }}
  />
));

export default ({ width, height }) => (
  <g>
    <ScrollField x={0} height={height} direction={-1} />
    <ScrollField x={width - 50} height={height} direction={1} />
  </g>
);
