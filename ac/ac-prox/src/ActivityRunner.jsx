// @flow

import React from 'react';
import { type ActivityRunnerT } from 'frog-utils';

import HasNoGroupPanel from './NoGroupPanel';
import HasGroupPanel from './GroupPanel';

export default (props: ActivityRunnerT) => {
  const { data, userInfo: { id } } = props;
  const hasGroup = data.students[id];

  return (
    <div style={{ margin: '5%' }}>
      {hasGroup ? <HasGroupPanel {...props} /> : <HasNoGroupPanel {...props} />}
    </div>
  );
};
