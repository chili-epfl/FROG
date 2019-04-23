// @flow

import React from 'react';
import { type ActivityRunnerPropsT } from 'frog-utils';

import HasNoGroupPanel from './NoGroupPanel';
import HasGroupPanel from './GroupPanel';
import SmallClass from './SmallClass';

export default (props: ActivityRunnerPropsT) => {
  const {
    activityData: { config },
    data,
    userInfo: { id }
  } = props;
  const hasGroup = data.students[id];

  return (
    <div className="bootstrap" style={{ margin: '5%' }}>
      {config.largeClass ? (
        hasGroup ? (
          <HasGroupPanel {...props} />
        ) : (
          <HasNoGroupPanel {...props} />
        )
      ) : (
        <SmallClass {...props} />
      )}
    </div>
  );
};
