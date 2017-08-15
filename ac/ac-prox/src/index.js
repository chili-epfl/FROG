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
  exampleData: [{ title: 'Case with no data', config: { title: 'Group creator' }, data: {} }],
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string',
    },
    maxByGrp: {
      title: 'Maximum number of students in a group',
      type: 'number',
    },
  },
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  dataFn.objInsert([], 'students');
  dataFn.objInsert([], 'groups');
};

const genCodeOfNChar = (n: number) => {
  let res = [];
  for (let i = 0; i < n; i += 1) res.push(genLetterCode());
  return res;
};

const genLetterCode = () =>
  65 + Math.round(Math.random() * 10) % 2 * 32 + Math.round(Math.random() * 25);

// the actual component that the student sees
const ActivityRunner = compose(withState(
  'textGrp',
  'setText',
  '',
),withState(
  'grpSelected',
  'setSelected',
  false,
))(({textGrp, setText, grpSelected, setSelected, activityData, data, dataFn, userInfo }) => {
  console.log(data);
  return (
    <div style={{ margin: '5%' }}>
      <div style={{ display: 'flex', flexDirection: 'row', height: '50px', width: '500px' }}>
        {!grpSelected &&
          <button
            className="btn btn-primary"
            onClick={() => {
              const tmp = genCodeOfNChar(4).reduce((acc, x) => (acc += String.fromCharCode(x)), '');
              dataFn.listAppend({ id: userInfo.id, group: tmp }, 'students');
              dataFn.listAppend({ grpId: tmp, studentsId: [userInfo.id] }, 'groups');
              // dataFn.objInsert({group: tmp}, 'students.'+userInfo.id);
              // dataFn.objInsert({studentsId: [userInfo.id] }, 'groups.'+tmp);
              setSelected(true);
            }}
            style={{ marginRight: '10px' }}
          >
            <span className={'glyphicon glyphicon-plus'} style={{ width: '30px' }} />{' '}
            {'Create Group'}
          </button>}
        <div className="well" style={{ height: '100%', width: '100%' }}>
          {grpSelected ? data.students.filter(x => x.id === userInfo.id)[0].group : ''}
          {/*grpSelected ? data.students[userInfo.id] : ''*/}
        </div>
        {grpSelected &&
          <button
            className="btn btn-danger"
            onClick={() => {
              // listDel doesn't work ?
              // dataFn.listDel(data.students.find(x => x.id === userInfo.id), 'students');
              dataFn.objInsert(data.students.filter(x => x.id !== userInfo.id), 'students');
              //dataFn.objDel(, 'students.'+userInfo.id);
              const tmp = data.groups.find(x => x.studentsId.includes(userInfo.id));
              if (tmp.studentsId.length === 1)
                dataFn.objInsert(
                  data.groups.filter(x => !x.studentsId.includes(userInfo.id)),
                  'groups',
                );
              else
                dataFn.listReplace(
                  tmp,
                  { grpId: tmp.grpId, studentsId: tmp.studentsId.filter(x => x !== userInfo.id) },
                  'groups',
                );

              // data.students.filter(x => x.id === userInfo.id)
              setSelected(false);
            }}
            style={{ marginLeft: '10px' }}
          >
            {'Cancel'}
          </button>}
      </div>
      <br />
      {!grpSelected &&
        <div className="input-group" style={{ width: '500px' }}>
          <input type="text" className="form-control" aria-describedby="basic-addon3" onChange={e => {
            setText(e.target.value);
          }}/>
          <span className="input-group-btn">
            <button className="btn btn-default" type="button" onClick={(e) => {
              if(data.groups.find(x => x.grpId === textGrp)){
                const tmp = data.groups.find(x => x.grpId === textGrp);
                dataFn.listAppend({ id: userInfo.id, group: tmp }, 'students');
                dataFn.listReplace(tmp, { grpId: tmp, studentsId: [...tmp.studentsId, userInfo.id] }, 'groups');
                setSelected(true);
              }
            }}>
              {'Join Group'}
            </button>
          </span>
        </div>}
    </div>
  );
});

export default ({
  id: 'ac-prox',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction,
}: ActivityPackageT);
