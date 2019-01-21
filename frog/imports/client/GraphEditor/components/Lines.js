// @flow
import * as React from 'react';
import { observer } from 'mobx-react';

import { connect, type StoreProp } from '../store';
import Connection from '../store/connection.js';

import { getMiddle } from '../utils/path';

export const Line = observer(
  ({ connection, scaled }: { connection: Connection, scaled: boolean }) => {
    const [x, y] = (connection.source &&
      connection.target &&
      getMiddle({
        source: connection.source.dragPointFromScaled,
        target: connection.target.dragPointToScaled
      })) || [-100, -100];
    return (
      <g>
        <path
          d={scaled ? connection.pathScaled : connection.path}
          fill="transparent"
          stroke={connection.selected ? '#ff9900' : 'grey'}
          strokeWidth="2"
        />
        {x && y && <circle cx={x} cy={y} r="5" fill="red" />}
        <path
          d={scaled ? connection.pathScaled : connection.path}
          onClick={connection.select}
          fill="transparent"
          stroke="transparent"
          strokeWidth="12"
        />
      </g>
    );
  }
);

export const DragLine = connect(
  ({
    store: {
      connectionStore: { dragPath },
      state
    }
  }: StoreProp) => {
    if (state.mode !== 'dragging') {
      return null;
    }
    return (
      <path d={dragPath} fill="transparent" stroke="grey" strokeWidth="2" />
    );
  }
);

export default connect(
  ({
    store: {
      connectionStore: { all: connections }
    },
    scaled
  }: StoreProp & { scaled: boolean }) => (
    <g>
      {connections.map(connection => (
        <Line scaled={scaled} key={connection.id} connection={connection} />
      ))}
    </g>
  )
);
