import React from 'react';
import { connect } from './store';
import { TextInput } from './utils';

const RenameField = connect((
  { store: { panx, renameOpen, scale, cancelAll } }
) => {
  if (!renameOpen) {
    return null;
  }
  const left = renameOpen.x * scale - panx * 4 * scale;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${renameOpen.y}px`
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
