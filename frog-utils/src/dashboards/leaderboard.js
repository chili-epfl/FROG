// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { type LogDBT, type dashboardViewerPropsT } from '../';

const Viewer = (props: dashboardViewerPropsT) => {
  const { data, config, users, activity } = props;
  if (!config) {
    return null;
  }

  const ranking = Object.keys(data.scores).sort((a, b) => {
    if (data.scores[a].score === data.scores[b].score) {
      return (
        new Date(data.scores[a].timestamp) - new Date(data.scores[b].timestamp)
      );
    }
    return data.scores[b].score - data.scores[a].score;
  });

  const isGroup = activity.plane === 2 ? 1 : 0;

  return (
    <div style={{ margin: '20px', backgroundColor: 'white' }}>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Rank</th>
            <th>{isGroup ? 'Group' : 'Name'}</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {ranking.map((item, index) => (
            <tr key={item}>
              <td className="col-md-4">{index + 1}</td>
              <td className="col-md-4">{isGroup ? item : users[item]}</td>
              <td className="col-md-4">{data.scores[item].score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.type === 'score') {
    dataFn.objInsert({ score: log.value, timestamp: log.timestamp }, [
      'scores',
      log.instanceId
    ]);
  }
};

const initData = {
  scores: {}
};

export default {
  Viewer,
  mergeLog,
  initData
};
