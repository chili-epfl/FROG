// @flow

import React from 'react';
import { ReactiveText, type ActivityRunnerT } from 'frog-utils';

export default (props: ActivityRunnerT) => {
  const { logger, dataFn } = props;
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
};
