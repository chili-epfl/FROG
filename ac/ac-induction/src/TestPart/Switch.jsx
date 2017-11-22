// @flow

import React from 'react';
import { Button } from 'react-bootstrap';

const TFButton = ({ type, choice, onClick }) => (
  <Button
    bsStyle={choice === type ? (type ? 'success' : 'danger') : 'default'}
    bsSize="large"
    active={false}
    style={{ width: '150px', margin: '20px' }}
    onClick={() => onClick(type)}
  >
    {type ? 'True' : 'False'}
  </Button>
);

export default ({ tmpList, feedback, data, dataFn }: Object) => {
  const onClick = type => {
    const path = [
      feedback ? ('listIndexTestWithFeedback'+data.indexPart) : ('listIndexTest'+data.indexPart),
      data.indexCurrent
    ];
    dataFn.objInsert(type, [...path, 'selectedChoice']);
    dataFn.objInsert([], [...path, 'selectedProperties']);
  };

  const choice = tmpList[data.indexCurrent].selectedChoice;

  return (
    <div>
      <TFButton type {...{ choice, onClick }} />
      <TFButton type={false} {...{ choice, onClick }} />
    </div>
  );
};
