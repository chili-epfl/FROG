import React from 'react';
import { connect } from './store';
import { TextInput } from './utils';
import * as constants from './constants';

const RenameField = connect((
  { store: { panx, renameOpen, rename, scale, cancelAll } }
) => {
  if (!renameOpen) {
    return null;
  }
  const left = constants.GRAPH_LEFT + (renameOpen.x * scale - panx * 4 * scale);
  return (
    <div
      style={{
        position: 'fixed',
        left: `${left}px`,
        top: `${renameOpen.y + constants.GRAPH_TOP}px`
      }}
    >
      <TextInput
        value={renameOpen.title}
        onSubmit={x => renameOpen.rename(x)}
        onCancel={cancelAll}
      />
    </div>
  );
});

export default RenameField;
