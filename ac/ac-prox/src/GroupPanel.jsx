// @flow

import React from 'react';

const onClickCancel = (data, dataFn, id) => {
  dataFn.objInsert(data.students.filter(x => x.id !== id), 'students');
  const tmp = data.groups.find(x => x.studentsId.includes(id));
  if (tmp.studentsId.length === 1)
    dataFn.objInsert(
      data.groups.filter(x => !x.studentsId.includes(id)),
      'groups',
    );
  else {
    const tmp2 = {
      grpId: tmp.grpId,
      studentsId: tmp.studentsId.filter(x => x !== id),
    };
    const tmp3 = [...data.groups.filter(x => !x.studentsId.includes(id)), tmp2];
    dataFn.objInsert(tmp3, 'groups');
  }
};

export default props =>
  <div>
    <div
      style={{
        height: '50px',
        width: '500px',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      <a
        className="btn btn-secondary btn-lg disabled"
        aria-disabled="true"
        style={{ marginRight: '10px' }}
      >
        {'Group :'}
      </a>
      <div className="well" style={{ height: '100%', width: '100%' }}>
        { props.data.students.filter(x => x.id === props.userInfo.id)[0].group }
      </div>
      <button
        className="btn btn-danger"
        onClick={onClickCancel(props.data, props.dataFn, props.userInfo.id)}
        style={{ marginLeft: '10px' }}
      >
        {'Cancel'}
      </button>
    </div>
  </div>;
