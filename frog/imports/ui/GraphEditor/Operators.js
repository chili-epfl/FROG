// @flow
import React from 'react';
import Operator from './Operator';
import { connect, type StoreProp } from './store';

export default connect(
  ({
    store: {
      operatorStore: { all: operators },
      ui: { socialCoords, socialCoordsScaled },
      state
    },
    scaled
  }: StoreProp & { scaled: boolean }) => {
    const ops = operators.map(op => {
      const coords = scaled ? op.coordsScaled : op.coords;
      return (
        <Operator
          key={op.id}
          x={coords[0]}
          y={coords[1]}
          color={op.color}
          onLeave={op.onLeave}
          onOver={op.onOver}
          onClick={op.select}
          selected={op.selected}
          highlighted={op.highlighted}
          startDragging={op.startDragging}
          onDrag={op.onDrag}
          onStop={op.stopDragging}
          type={op.subtype}
          strokeColor={op.strokeColor}
        />
      );
    });
    let dragOp;
    if (state.mode === 'placingOperator') {
      const coords = scaled ? socialCoordsScaled : socialCoords;
      dragOp = (
        <Operator type={state.operatorType} x={coords[0]} y={coords[1]} />
      );
    } else {
      dragOp = null;
    }

    return (
      <g>
        {ops}
        {scaled && dragOp}
      </g>
    );
  }
);
