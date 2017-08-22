// @flow

import React from 'react';
import styled from 'styled-components';
import { type ActivityRunnerT } from 'frog-utils';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Panel = styled.div`
  width: 100%;
  margin: 5px;
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
`;

const GroupPanel = ({ data, dataFn, userInfo: { id } }: ActivityRunnerT) => {
  const onClickCancel = () => {
    dataFn.objInsert(null, ['students', id]);
  };
  const currentGroup = data.students[id];
  const inGroupCount = Object.values(data.students).reduce(
    (acc, x) => (x === currentGroup ? acc + 1 : acc),
    0
  );

  return (
    <Main>
      <Panel>
        <span
          style={{ color: 'slategrey', fontSize: 'x-large', margin: '5px' }}
        >
          Group:
        </span>
        <span className="well" style={{ flex: '0 1 150px', margin: '5px' }}>
          {currentGroup}
        </span>
        <button
          className="btn btn-danger"
          onClick={onClickCancel}
          style={{ height: '60px', margin: '5px' }}
        >
          Leave this group
        </button>
      </Panel>
      <span style={{ fontSize: 'large' }}>
        {' '}Your group has {inGroupCount} members{' '}
      </span>
    </Main>
  );
};

GroupPanel.displayName = 'GroupPanel';
export default GroupPanel;
