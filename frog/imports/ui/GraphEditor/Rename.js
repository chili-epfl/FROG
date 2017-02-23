// @flow
import React from 'react';
import { connect, type StoreProp } from './store';
import TextInput from './utils/TextInput';

const RenameField = connect((
  { store: { ui: { cancelAll }, state } }: StoreProp
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
        onSubmit={x => renameOpen.rename(x)}
        onCancel={cancelAll}
      />
    </div>
  );
});

export default RenameField;
