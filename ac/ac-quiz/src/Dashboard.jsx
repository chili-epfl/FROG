// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import {
  type LogDBT,
  type dashboardViewerPropsT,
  type ActivityDbT
} from 'frog-utils';

const TIMEWINDOW = 5;

const Viewer = (props: dashboardViewerPropsT) => {
  const { data, config, users, activity } = props;

  if (!config) {
    return null;
  }

  const ranking = Object.keys(data.progress).sort(
    (a, b) => data.progress[b] - data.progress[a]
  );

  const isPreview = activity.plane === undefined ? 1 : 0;

  return (
    <div style={{ margin: '20px', backgroundColor: 'white' }}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>{isPreview ? 'Group' : 'Name'}</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((item, index) => (
            <tr key={item}>
              <td className="col-md-4">{index + 1}</td>
              <td className="col-md-4">{isPreview ? item : users[item]}</td>
              <td className="col-md-4">{data.progress[item]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mergeLog = (
  data: any,
  dataFn: Object,
  log: LogDBT,
  activity: ActivityDbT
) => {
  if (log.itemId !== undefined && log.type === 'choice') {
    if (!data[log.instanceId]) {
      dataFn.objInsert({ [log.itemId]: log.value }, [log.instanceId]);
    } else {
      dataFn.objInsert(log.value, [log.instanceId, log.itemId]);
    }
  } else if (
    log.type === 'progress' &&
    typeof log.value === 'number' &&
    activity.actualStartingTime !== undefined
  ) {
    const progDiff =
      (data['timing'][data['timing'].length - 1][1] || 0) +
      log.value -
      (data.progress[log.instanceId] || 0);
    dataFn.objInsert(log.value, ['progress', log.instanceId]);

    // $FlowFixMe
    const timeDiff = (log.timestamp - activity.actualStartingTime) / 1000;

    const max =
      log.value > data['timing'][data['timing'].length - 1][2]
        ? log.value
        : data['timing'][data['timing'].length - 1][2];

    if (
      Math.ceil(timeDiff / TIMEWINDOW) !==
      data['timing'][data['timing'].length - 1][0] / TIMEWINDOW
    ) {
      dataFn.listAppend(
        [Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW, progDiff, max, 0],
        'timing'
      );
    } else {
      data['timing'][data['timing'].length - 1] = [
        Math.ceil(timeDiff / TIMEWINDOW) * TIMEWINDOW,
        progDiff,
        max,
        0
      ];
      dataFn.objInsert(data['timing'], 'timing');
    }
  }
};

const initData = {
  progress: {},
  timing: [[0, 0, 0, 0]]
};

export default {
  Viewer,
  mergeLog,
  initData
};
