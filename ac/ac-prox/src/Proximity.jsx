// @flow

import React from 'react';
import { withState, compose } from 'recompose';
import HasNoGroupPanel from './NoGroupPanel';
import HasGroupPanel from './GroupPanel';

export default compose(
  withState('textGrp', 'setText', ''),
  withState('errLog', 'setErr', ''),
)(({ textGrp, setText, errLog, setErr, activityData, data, dataFn, userInfo }) => {
  const props = {
    textGrp,
    setText,
    errLog,
    setErr,
    activityData,
    data,
    dataFn,
    userInfo,
  };
  return;
  <div style={{ margin: '5%' }}>
    {data.students.find(x => x.id === userInfo.id) === undefined && <HasNoGroupPanel props />}
    {data.students.find(x => x.id === userInfo.id) !== undefined && <HasGroupPanel props />}
  </div>;
});
