// @flow
import React from 'react';
import Operator from './Operator';
import { connect, type StoreProp } from './store';
import { Activities, Operators, Connections } from '../../api/activities';
import valid from '../../api/validGraphFn';

export default connect(
  ({
    store: {
      graphId,
      operatorStore: { all: operators },
      ui: { socialCoords, socialCoordsScaled },
      state
    },
    scaled
  }: StoreProp & { scaled: boolean }) => {
    const acts = Activities.find({ graphId: graphId }).fetch();
    const opers = Operators.find({ graphId: graphId }).fetch();
    const cons = Connections.find({ graphId: graphId }).fetch();
    const v = valid(acts, opers, cons);

    const ops = operators.map(op => {
      const coords = scaled ? op.coordsScaled : op.coords;
      return (
        <Operator
          key={op.id}
          x={coords[0]}
          y={coords[1]}
          color={v.filter( e => e.id === op.id).length === 0 ? op.color : '#FFA0A0'}
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
