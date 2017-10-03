// @flow

import React from 'react';

import ImgBis from '../ImgBis';
import ModalSubmit from './ModalSubmit';
import Switch from './Switch';
import ResponsePanel from './ResponsePanel';
import { ExMain, ExContainer, ExLine, ExButton } from '../StyledComponents';

// with a param hasFeedback
export default ({
  title,
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
      <ExContainer style={{ padding: '20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-evenly'
          }}
        >
          <h4>This image corresponds to an example of the concept </h4>
          <Switch data={data} dataFn={dataFn} />
        </div>
        <ResponsePanel title={title} data={data} dataFn={dataFn} />
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
