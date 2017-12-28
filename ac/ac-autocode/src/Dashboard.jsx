// @flow

import React from 'react';

import { type LogDBT } from 'frog-utils';

const Viewer = (props: Object) => (
  <div>
    <h1>Dashboard for activity: {props.config.title}</h1>
    <p>Graph 1</p>
    <pre>{JSON.stringify(props, null, 2)}</pre>
  </div>
);

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  let previousStatus = '';
  if (data.students[log.userId]) {
    dataFn.objInsert(log.payload, ['students', log.userId, 'code']);
    if (data.students[log.userId][log.itemId]) {
      previousStatus = data.students[log.userId][log.itemId].status;
      dataFn.numIncr(1, ['students', log.userId, log.itemId, log.value]);
      dataFn.objInsert(log.value, [
        'students',
        log.userId,
        log.itemId,
        'status'
      ]);
    } else {
      dataFn.objInsert(
        {
          status: log.value,
          success: log.value === 'success' ? 1 : 0,
          danger: log.value === 'danger' ? 1 : 0,
          error: log.value === 'error' ? 1 : 0
        },
        ['students', log.userId, log.itemId]
      );
    }
  } else {
    log.itemId !== undefined &&
      dataFn.objInsert(
        {
          code: log.payload,
          [log.itemId]: {
            status: log.value,
            success: log.value === 'success' ? 1 : 0,
            danger: log.value === 'danger' ? 1 : 0,
            error: log.value === 'error' ? 1 : 0
          }
        },
        ['students', log.userId]
      );
  }

  if (log.type === 'test') {
    if (data.tests[log.itemId]) {
      dataFn.numIncr(1, ['tests', log.itemId, log.value]);
      previousStatus &&
        dataFn.numIncr(-1, ['tests', log.itemId, previousStatus]);
    } else {
      dataFn.objInsert(
        {
          success: log.value === 'success' ? 1 : 0,
          danger: log.value === 'danger' ? 1 : 0,
          error: log.value === 'error' ? 1 : 0
        },
        ['tests', log.itemId]
      );
    }
  }
};

const initData = { logs: [], tests: {}, students: {} };

export default {
  Viewer,
  mergeLog,
  initData
};
