// @flow

import React from 'react';

import ImgBis from '../ImgBis';
import ModalSubmit from './ModalSubmit';
import Switch from './Switch';
import ResponsePanel from './ResponsePanel';
import Correction from './Correction';
import { stringToArray } from '../ArrayFun';
import {
  ExMain,
  ExContainer,
  ExLine,
  ExButton,
  TestResponseHeader
} from '../StyledComponents';

export default ({
  title,
  properties,
  examples,
  nbTest,
  nbTestFeedback,
  feedback,
  dataFn,
  data
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
      dataFn.objInsert(true, 'feedbackOpen');
    } else if (data.indexCurrent === nbTest - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
  };

  return (
    <ExMain>
      <ExContainer>
        <ImgBis url={examples[tmpList[data.indexCurrent].realIndex].url} />
      </ExContainer>
      <ExLine />
      <ExContainer style={{ padding: '20px' }}>
        <TestResponseHeader>
          <h3>This image corresponds to an example of the concept </h3>
          <Switch
            tmpList={tmpList}
            feedback={feedback}
            data={data}
            dataFn={dataFn}
          />
        </TestResponseHeader>
        <ResponsePanel
          title={title}
          examples={examples}
          properties={properties}
          tmpList={tmpList}
          feedback={feedback}
          data={data}
          dataFn={dataFn}
        />
        <ExButton className="btn btn-default" onClick={clickHandler}>
          Submit
        </ExButton>
      </ExContainer>
      {feedback &&
        <ModalSubmit
          examples={examples}
          properties={properties}
          dataFn={dataFn}
          data={data}
          nbTestFeedback={nbTestFeedback}
        />}
    </ExMain>
  );
};
