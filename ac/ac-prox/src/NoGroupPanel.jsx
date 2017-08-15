// @flow

import React from 'react';
import { shuffle } from 'lodash';
import { withState, compose } from 'recompose';

const groupchars = 'ABCDEFGHIJKLMNOPQRSTUWXYZ123456789'.split('');

const genCodeOfNChar = (n: number) => shuffle(groupchars).slice(0, n).join('');

const onClickCreate = (dataFn, id, setErr) => {
  const tmp = genCodeOfNChar(4);
  dataFn.listAppend({ id, group: tmp }, 'students');
  dataFn.listAppend({ grpId: tmp, studentsId: [id] }, 'groups');
  setErr('');
};

const onClickJoin = (textGrp, data, dataFn, maxByGrp, id, setErr) => {
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
      setErr('');
    } else setErr('Maximum number of members reached');
  } else setErr('No group found with this name');
};

export default compose(
  withState('textGrp', 'setText', ''),
  withState('errLog', 'setErr', '')
)((props, textGrp, setText, errLog, setErr) => {
  const {activityData, data, dataFn, userInfo } = props.props;
  return (
    <div style={{ width: '500px' }}>
      <button
        className="btn btn-primary"
        onClick={onClickCreate(dataFn, userInfo.id, setErr)}
        style={{ height: '50px', marginRight: '10px' }}
      >
        <span className={'glyphicon glyphicon-plus'} style={{ width: '30px' }} /> {'New group'}
      </button>
      <br />
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
            onClick={onClickJoin(
              textGrp,
              data,
              dataFn,
              activityData.config.maxByGrp,
              userInfo.id,
              setErr,
            )}
          >
            {'Join Group'}
          </button>
        </span>
      </div>
      <br />
      {errLog !== '' &&
        <div
          style={{
            border: 'red solid 2px',
            width: '500px',
            borderRadius: '7px',
            textAlign: 'center',
          }}
        >
          {errLog}
        </div>}
    </div>
  );
});
