// @flow

import React from 'react';
import { type LogDBT } from 'frog-utils';

// const actionTypes = ['upload', 'vote', 'zoom'];

const Viewer = ({ data }: Object) =>
  // console.log(data);
    <div>
      {
        data && data.users && data.users.map((x,i) =>
          <div>
            {'user '+i}
          </div>
        )
      }
    </div>


const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (!(data && data[log.instanceId])) {
    console.log('in the if');
    dataFn.objInsert({ examples: 0, testFeedback: 0, testWOFeedback: 0 }, [log.instanceId]);
  }
  console.log(data);
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
