import * as React from 'react';
import { ReactiveText } from '/imports/frog-utils';

// the actual component that the student sees
const ActivityRunner = ({ activityData, dataFn }) => {
  const conf = activityData.config;
  const header = conf && [
    conf.title && <h1 key="title">{conf.title}</h1>,
    conf.guidelines && (
      <p key="guidelines" style={{ fontSize: '20px' }}>
        {conf.guidelines}
      </p>
    ),
    <ul key="prompt" style={{ fontSize: '20px' }}>
      {conf.prompt && conf.prompt.split('\n').map(x => <li key={x}>{x}</li>)}
    </ul>
  ];
  return (
    <div style={{ height: '95%' }}>
      {header}
      <ReactiveText
        type="textarea"
        path="text"
        dataFn={dataFn}
        key="textarea"
        placeholder={conf && conf.placeholder}
        style={{ width: '100%', height: '100%', fontSize: '20px' }}
      />
    </div>
  );
};

export default ActivityRunner;
