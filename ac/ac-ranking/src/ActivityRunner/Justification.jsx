// @flow

import React from 'react';
import { ReactiveText, type ActivityRunnerPropsT } from 'frog-utils';

export default (props: ActivityRunnerPropsT) => {
  const {
    activityData: { config },
    logger,
    dataFn
  } = props;
  if (!config.justify) {
    return null;
  } else {
    return (
      <ReactiveText
        type="textarea"
        path={['justification']}
        logger={logger}
        dataFn={dataFn}
        placeholder="Justify your answer"
        style={{
          fontSize: '18px',
          width: '500px',
          height: '100px'
        }}
      />
    );
  }
};
