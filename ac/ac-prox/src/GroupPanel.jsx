// @flow

import React from 'react';
import styled from 'styled-components';

const Main = styled.div`
  height: 50px;
  width: 500px;
  display: flex;
  flexDirection: row;
`;

export default props => {
  const { activityData, data, dataFn, userInfo } = props.props;

  const onClickCancel = () => {
    dataFn.objInsert(data.students.filter(x => x.id !== userInfo.id), 'students');
    const tmp = data.groups.find(x => x.studentsId.includes(userInfo.id));
    if (tmp.studentsId.length === 1)
      dataFn.objInsert(data.groups.filter(x => !x.studentsId.includes(userInfo.id)), 'groups');
    else {
      const tmp2 = {
        grpId: tmp.grpId,
        studentsId: tmp.studentsId.filter(x => x !== userInfo.id),
      };
      const tmp3 = [...data.groups.filter(x => !x.studentsId.includes(userInfo.id)), tmp2];
      dataFn.objInsert(tmp3, 'groups');
    }
  };

  return (
    <Main>
      <a
        className="btn btn-secondary btn-lg disabled"
        aria-disabled="true"
        style={{ marginRight: '10px' }}
      >
        {'Group :'}
      </a>
      <div className="well" style={{ height: '100%', width: '100%' }}>
        {data.students.filter(x => x.id === userInfo.id)[0].group}
      </div>
      <button className="btn btn-danger" onClick={onClickCancel} style={{ marginLeft: '10px' }}>
        {'Leave this group'}
      </button>
    </Main>
  );
};
