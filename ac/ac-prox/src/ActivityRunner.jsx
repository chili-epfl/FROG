// @flow

import React from 'react';
import { type ActivityRunnerPropsT } from 'frog-utils';

import HasNoGroupPanel from './NoGroupPanel';
import HasGroupPanel from './GroupPanel';

export default (props: ActivityRunnerPropsT) => {
  const {
    data,
    userInfo: { id }
  } = props;
  const hasGroup = data.students[id];

  return (
    <div className="bootstrap" style={{ margin: '5%' }}>
      {hasGroup ? <HasGroupPanel {...props} /> : <HasNoGroupPanel {...props} />}
    </div>
  );
};
