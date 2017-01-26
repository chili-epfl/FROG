import React from "react";
import { DraggableCore } from "react-draggable";
import { connect } from "./store";
import { timeToPx } from "./utils";

const Box = ({ x, y, width, selected, highlighted }) => (
  <rect
    x={x}
    y={y}
    width={width}
    stroke={selected ? "#ff9900" : "grey"}
    fill={highlighted ? "yellow" : "white"}
    rx={10}
    height={30}
  />
);

const Activity = connect(({
    store: {
      startDragging,
      stopDragging,
      dragging,
      mode,
      draggingFromActivity,
      scale,
      startMoving,
      stopMoving,
      startResizing,
      stopResizing
    },
    activity,
    scaled
  }) =>
  {
    const x = scaled ? activity.xScaled : activity.x
    const width = scaled? activity.widthScaled : activity.width

    return (
      <g
        onMouseOver={activity.onOver}
        onMouseLeave={activity.onLeave}
        onDoubleClick={activity.setRename}
        onClick={activity.select}
      >
        <Box
          x={x}
          y={activity.y}
          width={width}
          highlighted={activity.highlighted}
          selected={activity.selected}
        />
        <svg style={{ overflow: "hidden" }} width={width + x - 20}>
          <text x={x + 3} y={activity.y + 20}>
            {activity.title}
          </text>
        </svg>
        <circle
          cx={x + width - 10}
          cy={activity.y + 15}
          r={5}
          fill="transparent"
          stroke="black"
        />
        <DraggableCore
          onStart={() => startDragging(activity)}
          onDrag={(_, { deltaX, deltaY }) => dragging(deltaX, deltaY)}
          onStop={stopDragging}
        >
          <circle
            cx={x + width - 10}
            cy={activity.y + 15}
            r={10}
            fill="transparent"
            stroke="transparent"
            style={{ cursor: "crosshair" }}
          />
        </DraggableCore>
        // resize box (x axis)
        <DraggableCore
          onStart={() => startResizing(activity)}
          onDrag={(_, { deltaX }) => activity.resize(deltaX)}
          onStop={stopResizing}
        >
          <rect
            fill="transparent"
            stroke="transparent"
            x={x + width - 5}
            y={activity.y}
            width={5}
            height={30}
            style={{ cursor: "ew-resize" }}
          />
        </DraggableCore>
        // moving the whole box
        <DraggableCore
          onStart={() => startMoving(activity)}
          onDrag={(_, { deltaX }) => activity.move(deltaX)}
          onStop={stopMoving}
        >
          <rect
            x={x}
            y={activity.y}
            fill="transparent"
            stroke="transparent"
            width={width - 20}
            height={30}
            style={{ cursor: "move" }}
          />
        </DraggableCore>
      </g>
    );
  });

export default connect(({ store: { activities }, scaled }) => (
  <g>
    {activities.map(x => <Activity activity={x} scaled={scaled} key={x.id} />)}
  </g>
));
