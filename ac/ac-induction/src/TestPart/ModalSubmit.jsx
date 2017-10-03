// @flow

import React from 'react';
import Modal from 'react-modal';

import { ExButton } from '../StyledComponents';

export default ({ dataFn, data, nbTestFeedback }: Object) => {
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
