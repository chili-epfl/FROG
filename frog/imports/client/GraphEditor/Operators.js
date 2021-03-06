// @flow

import * as React from 'react';
import Operator from './Operator';
import { connect, type StoreProp } from './store';

export default connect(
  ({
    store: {
      operatorStore: { all: operators, addOperator },
      ui: { socialCoords, socialCoordsScaled },
      state
    },
    scaled,
    transparent
  }: StoreProp & { scaled: boolean, transparent: boolean }) => {
    const ops = operators.map(op => {
      const coords = scaled ? op.coordsScaled : op.coords;
      return (
        <Operator
          title={op.title}
          transparent={transparent}
          key={op.id}
          x={coords[0] - 25}
          y={coords[1] - 25}
          color={op.color}
          onLeave={op.onLeave}
          onOver={op.onOver}
          onClick={op.select}
          selected={op.selected}
          highlighted={op.highlighted}
          startDragging={op.startDragging}
          onDrag={op.onDrag}
          onStop={op.stopDragging}
          type={op.type}
          strokeColor={op.strokeColor}
        />
      );
    });
    let dragOp;
    if (state.mode === 'placingOperator') {
      const coords = scaled ? socialCoordsScaled : socialCoords;
      // This -25, -25 is need so that operator are not dragged from
      // the top left corner when created
      dragOp = (
        <Operator
          type={state.operatorType}
          x={coords[0] - 25}
          y={coords[1] - 120}
          onClick={addOperator}
        />
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
