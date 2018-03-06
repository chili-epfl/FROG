import React from 'react';
import { omit, sum, compact, get } from 'lodash';

const Viewer = ({ data }: { data: Object }) => {
  const d = omit(data, 'students');
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
        Total students who have interacted: {Object.keys(data.students).length}
      </p>
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, rawlog: LogDBT) => {
  if (!rawlog.payload) {
    return null;
  }
  const log = JSON.parse(rawlog.payload.msg);
  if (!data.students[rawlog.userId]) {
    dataFn.objInsert(true, ['students', rawlog.userId]);
  }
  if (log.verb && log.verb.id === 'http://adlnet.gov/expapi/verbs/answered') {
    const id = log.object.id || 'id';
    if (!data[id]) {
      dataFn.objInsert(
        {
          name:
            get(log, 'object.definition.name["en-US"]') ||
            get(log, 'object.definition.description["en-US"]') ||
            '',
          students: {}
        },
        id
      );
    }
    dataFn.objInsert(log.result, [id, 'students', rawlog.userId]);
  }
};

const initData = { students: {} };

export default {
  Viewer,
  mergeLog,
  initData
};
