// @flow

import React from 'react';
import { type LogDBT } from 'frog-utils';

const actionTypes = ['P1', 'P2', 'P3','P4','P5', 'P6'];

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
    dataFn.objInsert({ examples: 0, testFeedback: 0, testWOFeedback: 0 }, [log.instanceId]);
  }

  if(actionTypes.includes(log.type)){

  }
  console.log(log.instanceId);
  console.log(data);
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
