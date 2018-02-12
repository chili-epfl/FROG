// @flow
/* eslint-disable react/no-array-index-key */

import React from 'react';
import {
  type LogDBT,
  type dashboardViewerPropsT
} from '../';

const Viewer = (props: dashboardViewerPropsT) => {
  const { data, config, users, activity } = props;
  if (!config) {
    return null;
  }

  const ranking = Object.keys(data.scores).sort(
    (a, b) => data.scores[b] - data.scores[a]
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
              <td className="col-md-4">{data.scores[item]}</td>
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
) => {
  if (log.type === 'score') {
    dataFn.objInsert(log.value, ['scores', log.instanceId]);
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
