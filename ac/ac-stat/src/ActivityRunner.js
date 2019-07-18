// @flow

import * as React from 'react';
import { type ActivityRunnerPropsT, values } from 'frog-utils';
import { omit } from 'lodash';

import DataGraph from './Components/DataGraph';

const style = {
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  overflow: 'hidden'
};

export default (props: ActivityRunnerPropsT) => {
  const {
    activityData: { config }
  } = props;
  let newData = props.data;

  if (!config?.editable && config?.dataSets) {
    const data = {};
    const newdatasets = JSON.parse(config.dataSets);
    newdatasets.forEach(({ trace, ...rest }) => {
      if (!data[trace]) data[trace] = { columns: [], values: [] };
      const tmpEntry = [];
      Object.keys(rest).forEach(key => {
        if (!data[trace].columns.includes(key)) {
          data[trace].columns.push(key);
        }
        tmpEntry.push(rest[key]);
      });
      data[trace].values.push(tmpEntry);
    });

    if (Object.keys(data).length > 1) {
      data['all datasets'] = {
        columns: [values(data)[0].columns[0], 'dataset'],
        values: Object.keys(data).reduce(
          (acc, cur) => [
            ...acc,
            ...data[cur].values.map(entry => [entry[0], cur])
          ],
          []
        )
      };
    }
    newData = data;
  }

  const axis = [
    Math.min(
      ...values(omit(newData, 'originalData')).map(ds =>
        Math.min(...ds.values.map(entry => entry[0]))
      )
    ),
    Math.max(
      ...values(omit(newData, 'originalData')).map(ds =>
        Math.max(...ds.values.map(entry => entry[0]))
      )
    )
  ];

  return (
    <div style={style}>
      <DataGraph {...{ ...props, data: newData }} axis={axis} />
      {config.doubleView && (
        <DataGraph {...{ ...props, data: newData }} axis={axis} />
      )}
    </div>
  );
};
