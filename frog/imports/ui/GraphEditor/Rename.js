// @flow
import React from 'react';
import { connect, type StoreProp } from './store';
import TextInput from './utils/TextInput';

export const RenameBox = connect(({
  store: {
    state,
    ui: { cancelAll }
  }
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
        top: `${renameOpen.y}px`
      }}
    >
      <RenameField activityId={renameOpen.id} onSubmit={cancelAll} />
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
  console.log(activityId, renameOpen);
  return (
    <TextInput
      value={renameOpen.title}
      onChange={renameOpen.rename}
      onCancel={onSubmit}
      onSubmit={onSubmit}
    />
  );
});
