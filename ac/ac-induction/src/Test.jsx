// @flow

import React from 'react';
import Modal from 'react-modal';

import ImgBis from './ImgBis';
import Switch from './Switch';
import { ExMain, ExContainer, ExLine, ExButton } from './StyledComponents';

const ModalSubmit = ({ dataFn, data, nbTestFeedback }: Object) => {
  const clickHandler = () => {
    dataFn.objInsert(false, 'feedbackOpen');
    if (data.indexCurrent === nbTestFeedback - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else {
      dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };
  return (
    <Modal isOpen={data.feedbackOpen} contentLabel="Modal">
      <h1>
        {'Solution : Example n°' + (data.indexCurrent + 1)}
      </h1>
      <p>
        The right answer was correct/incorret and you answered :
        correct/incorrect …
      </p>
      <ExButton className="btn btn-default" onClick={clickHandler}>
        {data.indexCurrent === nbTestFeedback - 1 ? 'Next part' : 'Next test'}
      </ExButton>
    </Modal>
  );
};

// with a param hasFeedback
export default ({
  examples,
  nbTest,
  nbTestFeedback,
  feedback,
  dataFn,
  data
}: Object) => {
  const clickHandler = () => {
    if (feedback) {
      dataFn.objInsert(true, 'feedbackOpen');
    } else if (data.indexCurrent === nbTest - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
  };

  const indexTest = feedback
    ? data.listIndexTestWithFeedback[data.indexCurrent]
    : data.listIndexTest[data.indexCurrent];

  return (
    <ExMain>
      <ExContainer>
        <ImgBis url={examples[indexTest].url} />
      </ExContainer>
      <ExLine />
      <ExContainer>
        Response panel
        <Switch data={data} dataFn={dataFn} />
        <ExButton className="btn btn-default" onClick={clickHandler}>
          Submit
        </ExButton>
      </ExContainer>
      <ModalSubmit
        dataFn={dataFn}
        data={data}
        nbTestFeedback={nbTestFeedback}
      />
    </ExMain>
  );
};
