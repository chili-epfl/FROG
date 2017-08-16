// @flow

import React from 'react';
import styled from 'styled-components';
import { type ActivityRunnerT } from 'frog-utils';

const Main = styled.div`
  height: 50px;
  width: 500px;
  display: flex;
  flexDirection: row;
`;

const GroupPanel = ({ data, dataFn, userInfo: { id } }: ActivityRunnerT) => {
  const onClickCancel = () => {
    dataFn.objInsert(null, ['students', id]);
  };
  const currentGroup = data.students[id];

  return (
    <Main>
      <span
        className="btn btn-secondary btn-lg disabled"
        aria-disabled="true"
        style={{ marginRight: '10px' }}
      >
        Group:
      </span>
      <div className="well" style={{ height: '100%', width: '100%' }}>
        {currentGroup}
      </div>
      <button
        className="btn btn-danger"
        onClick={onClickCancel}
        style={{ marginLeft: '10px' }}
      >
        Leave this group
      </button>
    </Main>
  );
};

GroupPanel.displayName = 'GroupPanel';
export default GroupPanel;
