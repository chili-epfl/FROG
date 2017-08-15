// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';
import { withState, compose } from 'recompose';

const meta = {
  name: 'Proximity',
  type: 'react-component',
  shortDesc: 'Manualy create group',
  description:
    'Gives the possibility for students to make their own group if followed by the prox operator',
  exampleData: [{ title: 'Case with no data', config: {}, data: {} }]
};

const config = {
  type: 'object',
  properties: {
    maxByGrp: {
      title: 'Maximum number of students in a group (Optional)',
      type: 'number'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  dataFn.objInsert([], 'students');
  dataFn.objInsert([], 'groups');
};

const genCodeOfNChar = (n: number) => {
  const res = [];
  for (let i = 0; i < n; i += 1) res.push(genLetterCode());
  return res;
};

const genLetterCode = () =>
  65 + Math.round(Math.random() * 10) % 2 * 32 + Math.round(Math.random() * 25);

// the actual component that the student sees
const ActivityRunner = compose(
  withState('textGrp', 'setText', ''),
  withState('errLog', 'setErr', '')
)(
  ({
    textGrp,
    setText,
    errLog,
    setErr,
    activityData,
    data,
    dataFn,
    userInfo
  }) =>
    <div style={{ margin: '5%' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: '50px',
          width: '500px'
        }}
      >
        {data.students.find(x => x.id === userInfo.id) === undefined &&
          <button
            className="btn btn-primary"
            onClick={() => {
              const tmp = genCodeOfNChar(4).reduce(
                (acc, x) => acc + String.fromCharCode(x),
                ''
              );
              dataFn.listAppend({ id: userInfo.id, group: tmp }, 'students');
              dataFn.listAppend(
                { grpId: tmp, studentsId: [userInfo.id] },
                'groups'
              );
              setErr('');
            }}
            style={{ marginRight: '10px' }}
          >
            <span
              className={'glyphicon glyphicon-plus'}
              style={{ width: '30px' }}
            />{' '}
            {'Create Group'}
          </button>}
        {data.students.find(x => x.id === userInfo.id) !== undefined &&
          <a
            className="btn btn-secondary btn-lg disabled"
            aria-disabled="true"
            style={{ marginRight: '10px' }}
          >
            {'Group :'}
          </a>}
        <div className="well" style={{ height: '100%', width: '100%' }}>
          {data.students.find(x => x.id === userInfo.id) !== undefined
            ? data.students.filter(x => x.id === userInfo.id)[0].group
            : ''}
        </div>
        {data.students.find(x => x.id === userInfo.id) !== undefined &&
          <button
            className="btn btn-danger"
            onClick={() => {
              dataFn.objInsert(
                data.students.filter(x => x.id !== userInfo.id),
                'students'
              );
              const tmp = data.groups.find(x =>
                x.studentsId.includes(userInfo.id)
              );
              if (tmp.studentsId.length === 1)
                dataFn.objInsert(
                  data.groups.filter(x => !x.studentsId.includes(userInfo.id)),
                  'groups'
                );
              else {
                const tmp2 = {
                  grpId: tmp.grpId,
                  studentsId: tmp.studentsId.filter(x => x !== userInfo.id)
                };
                const tmp3 = [
                  ...data.groups.filter(
                    x => !x.studentsId.includes(userInfo.id)
                  ),
                  tmp2
                ];
                dataFn.objInsert(tmp3, 'groups');
              }
            }}
            style={{ marginLeft: '10px' }}
          >
            {'Cancel'}
          </button>}
      </div>
      <br />
      {data.students.find(x => x.id === userInfo.id) === undefined &&
        <div className="input-group" style={{ width: '500px' }}>
          <input
            type="text"
            className="form-control"
            aria-describedby="basic-addon3"
            onChange={e => {
              setText(e.target.value);
            }}
          />
          <span className="input-group-btn">
            <button
              className="btn btn-default"
              type="button"
              onClick={() => {
                if (data.groups.find(x => x.grpId === textGrp)) {
                  const tmp = data.groups.find(x => x.grpId === textGrp);
                  if (
                    activityData.config.maxByGrp &&
                    tmp.studentsId.length < activityData.config.maxByGrp
                  ) {
                    const tmp2 = {
                      grpId: tmp.grpId,
                      studentsId: [...tmp.studentsId, userInfo.id]
                    };
                    const tmp3 = [
                      ...data.groups.filter(x => x.grpId !== textGrp),
                      tmp2
                    ];
                    dataFn.objInsert(
                      [...data.students, { id: userInfo.id, group: tmp.grpId }],
                      'students'
                    );
                    dataFn.objInsert(tmp3, 'groups');
                    setErr('');
                  } else setErr('Maximum number of members reached');
                } else setErr('No group found with this name');
              }}
            >
              {'Join Group'}
            </button>
          </span>
        </div>}
      <br />
      {errLog !== '' &&
        <div
          style={{
            border: 'red solid 2px',
            width: '500px',
            borderRadius: '7px',
            textAlign: 'center'
          }}
        >
          {errLog}
        </div>}
    </div>
);

export default ({
  id: 'ac-prox',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
