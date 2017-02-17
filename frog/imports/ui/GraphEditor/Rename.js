// @flow
import React from 'react';
import { connect, type StoreProp } from './store';
import { TextInput, timeToPx } from './utils';

const RenameField = connect((
  { store: { ui: { cancelAll, scale }, state } }: StoreProp
) => {
  if (state.mode !== 'rename') {
    return null;
  }
  const renameOpen = state.currentActivity;
  const left = timeToPx(renameOpen.startTime, scale);
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
