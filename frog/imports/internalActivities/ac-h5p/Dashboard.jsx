import React from 'react';
import { omit, sum, compact, get } from 'lodash';

const Viewer = ({ state }: { state: Object }) => {
  const d = omit(state, 'students');
  return (
    <div>
      <h1>Engagement</h1>
      {Object.keys(d).map(z => {
        const x = d[z];

        const success =
          sum(
            compact(
              Object.keys(x.students).map(
                y => x.students[y].score && x.students[y].score.scaled
              )
            )
          ) / Object.keys(x.students).length;
        return (
          <div key={x.name}>
            <h2>{x.name}</h2>Students participated:{' '}
            {Object.keys(x.students).length}
            <br />Average success rate: {success}
          </div>
        );
      })}
      <hr />
      <p>
        Total students who have interacted: {Object.keys(state.students).length}
      </p>
    </div>
  );
};

const mergeLog = (state: any, rawlog: LogDBT) => {
  if (!rawlog.payload) {
    return null;
  }
  const log = JSON.parse(rawlog.payload.msg);
  if (!state.students[rawlog.userId]) {
    state.students[rawlog.userId] = true;
  }
  if (log.verb && log.verb.id === 'http://adlnet.gov/expapi/verbs/answered') {
    const id = log.object.id || 'id';
    if (!state[id]) {
      state[id] = {
        name:
          get(log, 'object.definition.name["en-US"]') ||
          get(log, 'object.definition.description["en-US"]') ||
          '',
        students: {}
      };
    }
    state[id].students[rawlog.userId] = log.result;
  }
};

const initData = { students: {} };

export default {
  dashboard: {
    Viewer,
    mergeLog,
    initData
  }
};
