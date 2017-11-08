// @flow

import React from 'react';
import { ExMain, ExContainer, ExDiv, ExButton } from './StyledComponents';
import ImgBis from './ImgBis';

export default ({
  examples,
  nbExamples,
  dataFn,
  data,
  title,
  logger
}: Object) => {
  const clickHandler = () => {
    logger({ type: 'subPart', value: 'Examples' });
    if (data.indexCurrent === nbExamples - 1) {
      logger({ type: 'part', value: 'Examples' });
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else {
      dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };

  return (
    <ExMain>
      <ExContainer>
        <ImgBis
          url={examples[data.listIndexEx[data.indexCurrent].realIndex].url}
          color="black"
        />
      </ExContainer>
      <ExContainer
        style={{
          backgroundColor: examples[
            data.listIndexEx[data.indexCurrent].realIndex
          ].isIncorrect
            ? 'rgba(204, 0, 0, 0.5)'
            : 'rgba(0,153,0,0.15)'
        }}
      >
        <ExDiv style={{ height: '85%' }}>
          <h3>
            {'This ' +
              (examples[data.listIndexEx[data.indexCurrent].realIndex]
                .isIncorrect
                ? "is not a '"
                : "is a '") +
              title +
              "'"}
          </h3>
        </ExDiv>
        <ExDiv
          style={{ position: 'absolute', bottom: '20px', width: 'inherit' }}
        >
          {data.indexCurrent > 0 && (
            <ExButton
              className="btn btn-default"
              onClick={() => {
                logger({ type: 'unSubPart', value: 'Examples' });
                dataFn.objInsert(data.indexCurrent - 1, 'indexCurrent');
              }}
            >
              Previous example
            </ExButton>
          )}
          <ExButton className="btn btn-default" onClick={clickHandler}>
            {data.indexCurrent < nbExamples - 1 ? 'Next example' : 'Next part'}
          </ExButton>
        </ExDiv>
      </ExContainer>
    </ExMain>
  );
};
