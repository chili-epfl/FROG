// @flow
import * as React from 'react';
import { TextInput } from '/imports/frog-utils';

import { connect, type StoreProp } from './store';

export const RenameBox = connect(
  ({
    store: {
      state,
      ui: { endRename }
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
          left: `${renameOpen.screenX - 6}px`,
          top: `${renameOpen.y + 48}px`
        }}
      >
        <RenameField activityId={renameOpen.id} onSubmit={endRename} />
      </div>
    );
  }
);

export const RenameField = connect(
  ({
    store: {
      activityStore: { all }
    },
    activityId,
    onSubmit
  }: StoreProp & {
    activityId: string,
    onSubmit: Function
  }) => {
    const renameOpen = all.find(act => act.id === activityId);
    if (renameOpen) {
      return (
        <TextInput
          value={renameOpen.title}
          onFocus={e => e.target.select()}
          onCancel={onSubmit}
          onSubmit={(value: string) => {
            renameOpen.rename(value);
            onSubmit();
          }}
          style={{
            padding: '5px',
            fontSize: '12px',
            width: `calc(100% - 20px)`
          }}
        />
      );
    } else {
      return null;
    }
  }
);
