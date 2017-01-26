import React from 'react';
import { connect } from './store';
import { between, timeToPx, pxToTime } from './utils'

const TwoSidedArrow = ({ x }) => (
  <polygon
    x={x}
    y={300}
    points='492.426,246.213 406.213,160 406.213,231.213 86.213,231.213 86.213,
      160 0,246.213 86.213,332.427 86.213,261.213 406.213,261.213 406.213,332.427'
    transform={`translate(${x - 17} 300) scale(0.1) `}
  />
);

const VerticalLine = ({ x }) => (
  <line
    x1={x}
    y1={0}
    x2={x}
    y2={600}
    stroke='grey'
    strokeWidth={1}
    strokeDasharray='5,5'
  />
);

const ShadedBox = ({ x, current }) => (
  <rect
    stroke='transparent'
    fill='#f9f3d2'
    fillOpacity={0.3}
    x={Math.min(current, x)}
    y={0}
    width={Math.abs(x - current)}
    height={600}
  />
);

const DragGuide = connect(({ store: { scale, panTime, rightEdgeTime }, ...rest }) => {
  const s = (x) => timeToPx(x, scale)
  const current = Math.round(rest.current)
  const length = Math.round(rest.length)
  let x, edge
  if(rest.x > rightEdgeTime) {
    x = rightEdgeTime
    edge = true
  } else if(rest.x < panTime) {
    x = panTime
    edge = true
  } else {
    edge = false
    x = Math.round(rest.x)
  }

  const middle = (x + current) / 2.0 
  const timeText = Math.abs(x - current) + ' min.'
  const lengthText = length + ' min.'
  const activityMiddle = Math.round(rest.currentX) + (length / 2)

  return (
    <g>
      <text x={s(activityMiddle)} y={rest.y - 20}>
        {lengthText}
      </text>
      { (x - current) === 0 ? null :
          <g>
      <text x={s(middle)} y={300}>
        {timeText}
      </text>
      <TwoSidedArrow x={s(middle)} />
      { edge ? null : <VerticalLine x={s(x)} /> }
      <VerticalLine x={s(current)} />
      <ShadedBox x={s(x)} current={s(current)} />
    </g>
      }
    </g>
  );
});

export default connect((
  { store: { leftbound, rightbound, mode, currentActivity, scale } }
) =>
  {
    if (mode === 'resizing') {
      return rightbound
        ? <DragGuide
          x={rightbound.startTime}
          current={currentActivity.startTime + currentActivity.length}
          currentX={currentActivity.startTime}
          length={currentActivity.length}
          y={currentActivity.y}
        />
        : null;
    }
    // below is quite ugly - maybe move calculations to store? idea is to not render bars anymore if the overlap is allowed, and
    // the activity has already moved past the boundary of the adjacent activity
    if (mode === 'moving') {
      return (
        <g>
          {
            leftbound && leftbound.xScaled + leftbound.widthScaled < currentActivity.xScaled
              ? leftbound
                ? <DragGuide
                  x={leftbound.startTime + leftbound.length}
                  current={currentActivity.startTime}
                  currentX={currentActivity.startTime}
                  length={currentActivity.length}
                  y={currentActivity.y}
                />
              : <DragGuide x={0} currentX={currentActivity.startTime} current={currentActivity.startTime} length={currentActivity.length} y={currentActivity.y}
/>
              : null
          }
          {
            rightbound &&
              rightbound.startTime > currentActivity.startTime + currentActivity.length
              ? rightbound
                ? <DragGuide
                  x={rightbound.startTime}
                  length={currentActivity.length}
                  y={currentActivity.y}
                  currentX={currentActivity.startTime}
                  current={currentActivity.startTime + currentActivity.length}
                />
                : <DragGuide
                  x={4000}
                  length={currentActivity.length}
                  y={currentActivity.y}
                  currentX={currentActivity.startTime}
                  current={currentActivity.startTime + currentActivity.length}
                />
              : null
          }
        </g>
      );
    }
    return null;
  });
