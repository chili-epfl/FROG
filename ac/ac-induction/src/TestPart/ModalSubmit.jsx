// @flow

import React from 'react';
import Modal from 'react-modal';

import { ExButton } from '../StyledComponents';

export default ({ properties, dataFn, data, nbTestFeedback }: Object) => {
  const clickHandler = () => {
    dataFn.objInsert(false, 'feedbackOpen');
    if (data.indexCurrent === nbTestFeedback - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else {
      dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };
  console.log(data);
  return (
    <Modal isOpen={data.feedbackOpen} contentLabel="Modal">
      <h1>
        {'Solution : Example n°' + (data.indexCurrent + 1)}
      </h1>
      <div>
        {'You have selected that this image was: ' +
          (data.listIndexTestWithFeedback[data.indexCurrent].selectedChoice
            ? 'True'
            : 'False')}
      </div>
      <div>
        You have selected the following properties :
        <ul>
          {data.listIndexTestWithFeedback[
            data.indexCurrent
          ].selectedProperties.map(x =>
            <li key={x}>
              {properties[x]}
            </li>
          )}
        </ul>
      </div>
      <ExButton className="btn btn-default" onClick={clickHandler}>
        {data.indexCurrent === nbTestFeedback - 1 ? 'Next part' : 'Next test'}
      </ExButton>
    </Modal>
  );
};
