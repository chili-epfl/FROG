// @flow
import React from 'react';
import { TextInput } from 'frog-utils';

import { connect, type StoreProp } from './store';

export const RenameBox = connect(({
  store: { state, ui: { endRename } }
}: StoreProp) => {
  if (state.mode !== 'rename') {
    return null;
  }
  const renameOpen = state.currentActivity;
  return (
    <div
      style={{
        position: 'absolute',
        left: `${renameOpen.screenX}px`,
        top: `${renameOpen.y + 75}px`
      }}
    >
      <RenameField activityId={renameOpen.id} onSubmit={endRename} />
    </div>
  );
});

export const RenameField = connect(({
  store: { activityStore: { all } },
  activityId,
  onSubmit
}: StoreProp & {
  activityId: string,
  onSubmit: string
}) => {
  const renameOpen = all.find(act => act.id === activityId);
  return (
    <TextInput
      value={renameOpen.title}
      onChange={renameOpen.rename}
      onCancel={onSubmit}
      onSubmit={onSubmit}
    />
  );
});
