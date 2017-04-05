// @flow
import React from 'react';
import Operator from './Operator';
import { connect, type StoreProp } from './store';

export default connect(({
  store: {
    operatorStore: { all: operators },
    ui: { socialCoords, socialCoordsScaled },
    state: { mode, operatorType }
  },
  scaled
}: StoreProp & { scaled: Boolean }) => {
  const ops = operators.map(op => {
    const coords = scaled ? op.coordsScaled : op.coords;
    return (
      <Operator
        key={op.id}
        x={coords[0]}
        y={coords[1]}
        onLeave={op.onLeave}
        onOver={op.onOver}
        onClick={op.select}
        selected={op.selected}
        highlighted={op.highlighted}
        startDragging={op.startDragging}
        onDrag={op.onDrag}
        onStop={op.stopDragging}
        type={op.type}
      />
    );
  });
  let dragOp;
  if (mode === 'placingOperator') {
    const coords = scaled ? socialCoordsScaled : socialCoords;
    dragOp = <Operator type={operatorType} x={coords[0]} y={coords[1]} />;
  } else {
    dragOp = null;
  }

  return (
    <g>
      {ops}
      {scaled && dragOp}
    </g>
  );
});
