// @flow
import React from 'react';
import { connect, type StoreProp } from './store';
import TextInput from './utils/TextInput';

const RenameField = connect((
  { store: { ui: { cancelAll }, state, renameChange } }: StoreProp
) => {
  if (state.mode !== 'rename') {
    return null;
  }
  const renameOpen = state.currentActivity;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${renameOpen.screenX}px`,
        top: `${renameOpen.y}px`
      }}
    >
      <TextInput
        value={renameOpen.title}
        onSubmit={renameOpen.rename}
        onChange={renameChange}
        onCancel={cancelAll}
      />
    </div>
  );
});

export default RenameField;
