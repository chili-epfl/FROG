// @flow

import React from 'react';
import { shuffle } from 'lodash';
import { withState, compose } from 'recompose';
import styled from 'styled-components';
import { type ActivityRunnerPropsT, type LogT } from 'frog-utils';

const Main = styled.div`
  display: flex;
  width: 100%;
  max-width: 500px;
  margin: auto;
  flex-flow: column wrap;
  align-items: stretch;
`;

const NoGroupPanelState = compose(
  withState('textGrp', 'setText', ''),
  withState('errLog', 'setErr', '')
);

type NoGroupPanelT = ActivityRunnerPropsT & {
  setErr: string => void,
  setText: string => void,
  textGrp: string,
  errLog: string,
  logger: LogT => void
};

const NoGroupPanelPure = ({
  data,
  dataFn,
  userInfo: { id },
  setErr,
  setText,
  textGrp,
  errLog,
  logger
}: NoGroupPanelT) => {
  const onClickCreate = () => {
    const groupCode = genCodeOfNChar(4);
    dataFn.objInsert(id, ['groups', groupCode]);
    dataFn.objInsert(groupCode, ['students', id]);
    setErr('');
    logger({ type: 'group.create', itemId: groupCode });
  };

  const onClickJoin = () => {
    const groupToJoin = textGrp.toUpperCase();
    const groupExists = data.groups[groupToJoin];

    if (groupExists) {
      dataFn.objInsert(groupToJoin, ['students', id]);
      setErr('');
      logger({ type: 'group.join', itemId: groupToJoin });
    } else {
      setErr('No group found with this name');
      logger({ type: 'group.joinMissing', itemId: groupToJoin });
    }
  };

  return (
    <Main>
      <NewGroupButton onClickCreate={onClickCreate} />
      <JoinGroupComponent onClickJoin={onClickJoin} setText={setText} />
      {errLog && <ErrorLog>{errLog}</ErrorLog>}
    </Main>
  );
};

const NoGroupPanel = NoGroupPanelState(NoGroupPanelPure);

const groupchars = 'ABCDEFGHIJKLMNOPQRSTUWXYZ123456789'.split('');

const genCodeOfNChar = (n: number) =>
  shuffle(groupchars)
    .slice(0, n)
    .join('');

const NewGroupButton = ({ onClickCreate }) => (
  <button
    className="btn btn-primary"
    onClick={onClickCreate}
    style={{ height: '50px', margin: '5px' }}
  >
    <span className="glyphicon glyphicon-plus" style={{ width: '30px' }} />
    New group
  </button>
);

const JoinGroupComponent = ({ setText, onClickJoin }) => (
  <div className="input-group" style={{ margin: '5px' }}>
    <input
      type="text"
      className="form-control"
      aria-describedby="basic-addon3"
      onChange={e => setText(e.target.value)}
    />
    <span className="input-group-btn">
      <button className="btn btn-default" type="button" onClick={onClickJoin}>
        Join existing group
      </button>
    </span>
  </div>
);

const ErrorLog = styled.div`
  border: red solid 2px;
  width: 500px;
  margin: 5px;
  borderradius: 7px;
  textalign: center;
`;

NoGroupPanel.displayName = 'NoGroupPanel';
export default NoGroupPanel;
