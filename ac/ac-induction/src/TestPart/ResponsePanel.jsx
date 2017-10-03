// @flow

import React from 'react';

export default ({ title, dataFn, data }: Object) => {
  const choice = data.testChoice;
  return (
    <div style={{ width: '100%', height: '80%' }}>
      {choice
        ? <TruePanel title={title} data={data} dataFn={dataFn} />
        : <FalsePanel title={title} data={data} dataFn={dataFn} />}
    </div>
  );
};

const TruePanel = ({ title, dataFn, data }: Object) =>
  <div style={{ width: '100%', height: '100%' }}>
    <h3>
      {'Why does this image correspond to the concept: ' + title}
    </h3>
  </div>;

const FalsePanel = ({ title, dataFn, data }: Object) =>
  <div style={{ width: '100%', height: '100%' }}>
    <h3>
      {"Why doesn't this image correspond to the concept: " + title}
    </h3>
  </div>;
