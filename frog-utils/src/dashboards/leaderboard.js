// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import { type LogDBT, type DashboardViewerPropsT } from '../';

const Viewer = (props: DashboardViewerPropsT) => {
  const {
    users,
    activity: { data: config },
    state,
    activity
  } = props;
  if (!config) {
    return null;
  }

  const ranking = Object.keys(state.scores).sort((a, b) =>
    compare(state.scores[a], state.scores[b], 0)
  );

  const isGroup = activity.plane === 2 ? 1 : 0;

  return (
    <div
      className="bootstrap"
      style={{ margin: '20px', backgroundColor: 'white' }}
    >
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
              {state.scores[item].score.map((scoreItem, i) => (
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

const mergeLog = (state: any, log: LogDBT) => {
  if (log.type === 'score') {
    state.scores[log.instanceId] = {
      score: makeArray(log.value),
      timestamp: log.timestamp
    };
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
