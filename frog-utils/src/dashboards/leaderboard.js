// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { type LogDBT, type dashboardViewerPropsT } from '../';

const Viewer = (props: dashboardViewerPropsT) => {
  const { data, config, users, activity } = props;
  if (!config) {
    return null;
  }

  const ranking = Object.keys(data.scores).sort((a, b) =>
    compare(data.scores[a], data.scores[b], 0)
  );

  const isGroup = activity.plane === 2;

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
              {data.scores[item].score.map((scoreItem, i) => (
                <td className="col-md-4" key={i}>
                  {Math.abs(scoreItem)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const compare = (a: Object, b: Object, n: number) => {
  if (n >= a.score.length) {
    return a.timestamp - b.timestamp;
  } else if (a.score[n] === b.score[n]) {
    return compare(a, b, n + 1);
  } else {
    return b.score[n] - a.score[n];
  }
};

const makeArray = x => (Array.isArray(x) ? x : [x]);

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.type === 'score') {
    dataFn.objInsert(
      { score: makeArray(log.value), timestamp: log.timestamp },
      ['scores', log.instanceId]
    );
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
