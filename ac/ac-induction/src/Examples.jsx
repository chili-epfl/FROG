// @flow

import React from 'react';
import { ExMain, ExContainer, ExLine, ExButton } from './StyledComponents';
import ImgBis from './ImgBis';

export default ({ examples, nbExamples, dataFn, data, title }: Object) => {
  const clickHandler = () => {
    if (data.indexCurrent === nbExamples - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
  };

  return (
    <ExMain>
      <ExContainer>
        <ImgBis
          url={examples[data.listIndexEx[data.indexCurrent].realIndex].url}
          color="black"
        />
      </ExContainer>
      <ExLine />
      <ExContainer
        style={{
          backgroundColor: examples[
            data.listIndexEx[data.indexCurrent].realIndex
          ].isIncorrect
            ? 'rgba(204, 0, 0, 0.5)'
            : 'rgba(0,153,0,0.15)'
        }}
      >
        <h3 style={{ transform: 'translateY(200px)' }}>
          {'This ' +
            (examples[data.listIndexEx[data.indexCurrent].realIndex].isIncorrect
              ? "is not a '"
              : "is a '") +
            title +
            "'"}
        </h3>
        <ExButton className="btn btn-default" onClick={clickHandler}>
          {data.indexCurrent < nbExamples - 1 ? 'Next example' : 'Next part'}
        </ExButton>
      </ExContainer>
    </ExMain>
  );
};
