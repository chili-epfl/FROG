// @flow

import React from 'react';
import styled from 'styled-components';
import { type ActivityRunnerT } from 'frog-utils';

const Main = styled.div`
  display: flex;
  min-height: 100px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Panel = styled.div`
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: center;
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
        <span style={{color:'slategrey', fontSize: 'x-large'}}>
          Group:
        </span>
        <span className='well' style={{ flex: '0 1 150px', margin: '0' }}>
          {currentGroup}
        </span>
        <button
          className="btn btn-danger"
          onClick={onClickCancel}
          style={{ height: '60px' }}
        >
          Leave this group
        </button>
      </Panel>
      <span style={{fontSize: 'large'}}>
        {' '}Your group has {inGroupCount} members{' '}
      </span>
    </Main>
  );
};

GroupPanel.displayName = 'GroupPanel';
export default GroupPanel;
