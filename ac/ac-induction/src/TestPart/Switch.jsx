// @flow

import React from 'react';

export default ({ tmpList, feedback, data, dataFn }: Object) => {
  const onClickSwitch = () => {
    const newList = [...tmpList];
    newList[data.indexCurrent].selectedChoice = !newList[data.indexCurrent]
      .selectedChoice;
    newList[data.indexCurrent].selectedProperties = [];
    dataFn.objInsert(
      newList,
      feedback ? 'listIndexTestWithFeedback' : 'listIndexTest'
    );
  };

  return (
    <div className="btn-group" role="group" aria-label="...">
      <button
        className="btn btn-default"
        style={{
          backgroundColor: tmpList[data.indexCurrent].selectedChoice
            ? '#66CC00'
            : '#E0E0E0',
          width: tmpList[data.indexCurrent].selectedChoice ? '80px' : '8px',
          outline: 'none',
          height: '30px'
        }}
        tabIndex="-1"
        onClick={onClickSwitch}
      >
        {tmpList[data.indexCurrent].selectedChoice ? 'True' : ''}
      </button>
      <button
        className="btn btn-default"
        style={{
          backgroundColor: !tmpList[data.indexCurrent].selectedChoice
            ? '#CC0000'
            : '#E0E0E0',
          width: !tmpList[data.indexCurrent].selectedChoice ? '80px' : '8px',
          outline: 'none',
          height: '30px'
        }}
        tabIndex="-1"
        onClick={onClickSwitch}
      >
        {!tmpList[data.indexCurrent].selectedChoice ? 'False' : ''}
      </button>
    </div>
  );
};
