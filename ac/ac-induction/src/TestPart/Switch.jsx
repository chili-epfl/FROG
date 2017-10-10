// @flow

import React from 'react';

export default ({ data, dataFn }: Object) => {
  const onClickSwitch = () => {
    // if (!data.testChoice)
    dataFn.objInsert(!data.testChoice, 'testChoice');
    dataFn.objInsert([], 'tmpSelected');
  };

  return (
    <div className="btn-group" role="group" aria-label="...">
      <button
        className="btn btn-default"
        style={{
          backgroundColor: data.testChoice ? '#66CC00' : '#E0E0E0',
          width: data.testChoice ? '80px' : '8px',
          outline: 'none',
          height: '30px'
        }}
        tabIndex="-1"
        onClick={onClickSwitch}
      >
        {data.testChoice ? 'True' : ''}
      </button>
      <button
        className="btn btn-default"
        style={{
          backgroundColor: !data.testChoice ? '#CC0000' : '#E0E0E0',
          width: !data.testChoice ? '80px' : '8px',
          outline: 'none',
          height: '30px'
        }}
        tabIndex="-1"
        onClick={onClickSwitch}
      >
        {!data.testChoice ? 'False' : ''}
      </button>
    </div>
  );
};
