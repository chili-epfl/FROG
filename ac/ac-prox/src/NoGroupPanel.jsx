// @flow

import React from 'react';
import { shuffle } from 'lodash';
import { withState, compose } from 'recompose';
import styled from 'styled-components';

const NoGroupPanel = compose(
  withState('textGrp', 'setText', ''),
  withState('errLog', 'setErr', '')
)(({ data, dataFn, userInfo: { id }, setErr, setText, textGrp, errLog }) => {
  const onClickCreate = () => {
    const groupCode = genCodeOfNChar(4);
    dataFn.objInsert(id, ['groups', groupCode]);
    dataFn.objInsert(groupCode, ['students', id]);
    setErr('');
  };

  const onClickJoin = () => {
    const groupToJoin = textGrp.toUpperCase();
    const groupExists = data.groups[groupToJoin];

    if (groupExists) {
      dataFn.objInsert(groupToJoin, ['students', id]);
      setErr('');
    } else setErr('No group found with this name');
  };

  return (
    <div style={{ width: '500px' }}>
      <NewGroupButton onClickCreate={onClickCreate} />
      <div style={{ height: '10px' }} />
      <JoinGroupComponent onClickJoin={onClickJoin} setText={setText} />
      <div style={{ height: '10px' }} />
      {errLog &&
        <ErrorLog>
          {errLog}
        </ErrorLog>}
    </div>
  );
});

const groupchars = 'ABCDEFGHIJKLMNOPQRSTUWXYZ123456789'.split('');

const genCodeOfNChar = (n: number) => shuffle(groupchars).slice(0, n).join('');

const NewGroupButton = ({ onClickCreate }) =>
  <button
    className="btn btn-primary"
    onClick={onClickCreate}
    style={{ height: '50px', width: '100%' }}
  >
    <span className={'glyphicon glyphicon-plus'} style={{ width: '30px' }} />
    New group
  </button>;

const JoinGroupComponent = ({ setText, onClickJoin }) =>
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
      <button className="btn btn-default" type="button" onClick={onClickJoin}>
        Join existing group
      </button>
    </span>
  </div>;

const ErrorLog = styled.div`
  border: red solid 2px;
  width: 500px;
  borderRadius: 7px;
  textAlign: center;
`;

NoGroupPanel.displayName = 'NoGroupPanel';
export default NoGroupPanel;
