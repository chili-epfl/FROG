// @flow

import * as React from 'react';

import { type LogDBT, type dashboardViewerPropsT } from 'frog-utils';

const Viewer = ({ state, users, activity }: dashboardViewerPropsT) => {
  const { justifications } = state;
  if (Object.keys(justifications).length === 0) {
    return <p>No justifications written yet</p>;
  } else {
    return Object.keys(justifications).map(instance => {
      const instanceName = activity.plane === 1 && typeof users[instance] === 'string'
        ? users[instance]
        : instance
      return (
        <pre key={instance}>
          <p>{'From: ' + instanceName}</p>
          <p style={{ width: '100%', whiteSpace: 'pre-wrap' }}>
            {'Text: ' + justifications[instance]}
          </p>
        </pre>
      );
    });
  }
};

const mergeLog = (state: any, log: LogDBT) => {
  if (log.type === 'reactivetext.focus' || log.type === 'reactivetext.blur') {
    state.justifications[log.instanceId] = log.value;
  }
};

const initData = {
  justifications: {}
};

export default {
  Viewer,
  mergeLog,
  initData
};
