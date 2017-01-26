import React from "react";
import { DraggableCore } from "react-draggable";
import { connect, store } from "./store";
import { timeToPx } from "./utils";

export const PanMap = connect(({ store: { panx, panDelta, scale } }) => (
  <DraggableCore onDrag={(_, { deltaX }) => panDelta(deltaX)}>
    <rect
      x={panx}
      y={0}
      fill="transparent"
      stroke="black"
      strokeWidth={4}
      rx={10}
      width={250 / scale}
      height={150}
    />
  </DraggableCore>
));

const onDoubleClick = (x, e) => {
  store.addActivity(x, e.clientX);
};

export const LevelLines = connect(({ store: { scale } }) => (
  <g>
    {[ 1, 2, 3 ].map(x => (
        <g key={x}>
          <line
            x1={0}
            y1={x * 100 + 65}
            x2={4000 * scale}
            y2={x * 100 + 65}
            stroke="grey"
            strokeWidth={1}
            strokeDasharray="5,5"
          />
          <rect
            onDoubleClick={e => onDoubleClick(x, e)}
            x={0}
            y={x * 100 + 45}
            width={4000 * scale}
            fill="transparent"
            height={40}
          />
        </g>
      ))}
  </g>
));

export const TimeScale = connect(({ store: { scale } }) => {
  let a = 0;
  let res = [];
  while (a < 121) {
    a += 1;
    let text = null;
    let length = 0;

    const x = timeToPx(a, scale);
    if (a % 15 === 0) {
      length = 30;
      text = <text x={x - 15} y={540}>{a + " min."}</text>;
    } else if (a % 5 === 0) {
      length = 15;
    } else {
      length = 5;
    }

    res.push(
      <g key={a}>
        <line x1={x} y1={600 - length} x2={x} y2={600} stroke="grey" />
        {text}
      </g>
    );
  }
  return <g>{res}</g>;
});
