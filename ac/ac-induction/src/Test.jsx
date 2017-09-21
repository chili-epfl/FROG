// @flow

import React from 'react';
import Modal from 'react-modal';

import { ExMain, ExContainer, ExLine, ExButton } from './StyledComponents';

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

  console.log('Test');
  // onAfterOpen lancé au click
  // onRequestClose lancé au esc
  // aucun boutton quitter
  return (
    <ExMain>
      <ExContainer>Image</ExContainer>
      <ExLine />
      <ExContainer>
        Response panel
        <ExButton className="btn btn-default" onClick={clickHandler}>
          Submit
        </ExButton>
      </ExContainer>
      <Modal isOpen={data.feedbackOpen} contentLabel="Modal">
        <h1>Modal Content</h1>
        <p>Etc.</p>
      </Modal>
    </ExMain>
  );
};
