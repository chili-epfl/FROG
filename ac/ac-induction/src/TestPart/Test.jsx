// @flow

import React from 'react';

import ImgBis from '../ImgBis';
import ModalSubmit from './ModalSubmit';
import ResponsePanel from './ResponsePanel';
import Correction from './Correction';
import { stringToArray } from '../ArrayFun';
import { ExMain, ExContainer, ExDiv, ExButton } from '../StyledComponents';

export default ({
  title,
  properties,
  examples,
  nbTest,
  nbTestFeedback,
  feedback,
  dataFn,
  data,
  logger,
  groupingValue
}: Object) => {
  const tmpList = feedback
    ? data.listIndexTestWithFeedback
    : data.listIndexTest;

  const clickHandler = () => {
    const index = tmpList[data.indexCurrent];
    const caseAnswer = index.selectedChoice
      ? 0
      : index.realIndex % 2 === 0 ? 1 : 2;
    const correction = Correction(
      examples[index.realIndex].isIncorrect,
      caseAnswer,
      index.selectedProperties,
      stringToArray(examples[index.realIndex].respectedProperties),
      data.contradictories,
      data.unnecessaries,
      data.suffisants
    );
    const newList = [...tmpList];
    newList[data.indexCurrent].correction = correction;
    dataFn.objInsert(
      newList,
      feedback ? 'listIndexTestWithFeedback' : 'listIndexTest'
    );
    if (feedback) {
      logger({
        type: 'TestFB:' + groupingValue,
        value: '' + correction.result
      });
      dataFn.objInsert(true, 'feedbackOpen');
    } else {
      logger({ type: 'subPart', value: 'Test' });
      logger({ type: 'Test:' + groupingValue, value: '' + correction.result });
      if (data.indexCurrent === nbTest - 1) {
        logger({ type: 'part', value: 'Test' });
        dataFn.objInsert(0, 'indexCurrent');
        dataFn.objInsert(data.indexPart + 1, 'indexPart');
      } else dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };
  return (
    <ExMain>
      <ExContainer>
        <ImgBis url={examples[tmpList[data.indexCurrent].realIndex].url} />
      </ExContainer>
      <ExContainer style={{ padding: '20px' }}>
        <ResponsePanel
          {...{
            title,
            examples,
            properties,
            tmpList,
            feedback,
            data,
            dataFn
          }}
        />
        <ExDiv
          style={{ position: 'absolute', bottom: '20px', width: 'inherit' }}
        >
          <ExButton
            className="btn btn-default"
            onClick={
              tmpList[data.indexCurrent].selectedProperties.length > 0 ||
              (!feedback &&
                tmpList[data.indexCurrent].selectedChoice !== undefined)
                ? clickHandler
                : null
            }
            disabled={
              tmpList[data.indexCurrent].selectedProperties.length < 1 &&
              (feedback ||
                tmpList[data.indexCurrent].selectedChoice === undefined)
            }
          >
            Submit
          </ExButton>
        </ExDiv>
      </ExContainer>
      {feedback && (
        <ModalSubmit
          {...{ examples, properties, dataFn, data, logger, nbTestFeedback }}
        />
      )}
    </ExMain>
  );
};
