// @flow

import React from 'react';
import { shuffle } from 'lodash';
import { withState, compose } from 'recompose';
import styled from 'styled-components';

const groupchars = 'ABCDEFGHIJKLMNOPQRSTUWXYZ123456789'.split('');

const genCodeOfNChar = (n: number) => shuffle(groupchars).slice(0, n).join('');

const NewGrpButton = p =>
  <button
    className="btn btn-primary"
    onClick={p.onClickCreate}
    style={{ height: '50px', width: '100%' }}
  >
    <span className={'glyphicon glyphicon-plus'} style={{ width: '30px' }} /> {'New group'}
  </button>;

const JoinGrpCmpnt = p =>
  <div className="input-group" style={{ width: '500px' }}>
    <input
      type="text"
      className="form-control"
      aria-describedby="basic-addon3"
      onChange={e => {
        p.setText(e.target.value);
      }}
    />
    <span className="input-group-btn">
      <button className="btn btn-default" type="button" onClick={p.onClickJoin}>
        {'Join existing group'}
      </button>
    </span>
  </div>;

const ErrorLog = styled.div`
  border: red solid 2px;
  width: 500px;
  borderRadius: 7px;
  textAlign: center;
`;

export default compose(
  withState('textGrp', 'setText', ''),
  withState('errLog', 'setErr', ''),
)(props => {
  const { activityData, data, dataFn, userInfo } = props.props;
  const id = userInfo.id;

  const onClickCreate = () => {
    const tmp = genCodeOfNChar(4);
    dataFn.listAppend({ id, group: tmp }, 'students');
    dataFn.listAppend({ grpId: tmp, studentsId: [id] }, 'groups');
    props.setErr('');
  };

  const onClickJoin = () => {
    if (data.groups.find(x => x.grpId === textGrp)) {
      const tmp = data.groups.find(x => x.grpId === textGrp);
      const maxByGrp = maxByGrp || 999;
      if (tmp.studentsId.length < maxByGrp) {
        const tmp2 = {
          grpId: tmp.grpId,
          studentsId: [...tmp.studentsId, id],
        };
        const tmp3 = [...data.groups.filter(x => x.grpId !== textGrp), tmp2];
        dataFn.objInsert([...data.students, { id, group: tmp.grpId }], 'students');
        dataFn.objInsert(tmp3, 'groups');
        props.setErr('');
      } else props.setErr('Maximum number of members reached');
    } else props.setErr('No group found with this name');
  };

  return (
    <div style={{ width: '500px' }}>
      <NewGrpButton onClickCreate={onClickCreate} />
      <div style={{ height: '10px' }} />
      <JoinGrpCmpnt onClickJoin={onClickJoin} setText={props.setText} />
      <div style={{ height: '10px' }} />
      {props.errLog !== '' &&
        <ErrorLog>
          {props.errLog}
        </ErrorLog>}
    </div>
  );
});
