// @flow

import React from 'react';
import { ExMain, ExContainer, ExLine, ExButton } from './StyledComponents';

export default ({ examples, nbExamples, dataFn, data }: Object) => {
  const clickHandler = () => {
    if (data.indexCurrent === nbExamples - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
  };

  console.log('Examples');

  return (
    <ExMain>
      <ExContainer>Image</ExContainer>
      <ExLine />
      <ExContainer>
        Properties
        <ExButton className="btn btn-default" onClick={clickHandler}>
          {data.indexCurrent < nbExamples - 1 ? 'Next example' : 'Next part'}
        </ExButton>
      </ExContainer>
    </ExMain>
  );
};
