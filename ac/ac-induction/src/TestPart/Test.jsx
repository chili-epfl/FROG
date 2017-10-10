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
  properties,
  examples,
  nbTest,
  nbTestFeedback,
  feedback,
  dataFn,
  data
}: Object) => {
  const clickHandler = () => {
    if (feedback) {
      const tmpList = [...data.listIndexTestWithFeedback];
      tmpList[data.indexCurrent].selectedProperties = data.tmpSelected;
      dataFn.objInsert(tmpList, 'listIndexTestWithFeedback');
      dataFn.objInsert(true, 'feedbackOpen');
    } else {
      const tmpList = [...data.listIndexTest];
      tmpList[data.indexCurrent].selectedProperties = data.tmpSelected;
      dataFn.objInsert(tmpList, 'listIndexTest');
      if (data.indexCurrent === nbTest - 1) {
        dataFn.objInsert(0, 'indexCurrent');
        dataFn.objInsert(data.indexPart + 1, 'indexPart');
      } else dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
    dataFn.objInsert([], 'tmpSelected');
  };

  const indexTest = feedback
    ? data.listIndexTestWithFeedback[data.indexCurrent].realIndex
    : data.listIndexTest[data.indexCurrent].realIndex;

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
          <h3>This image corresponds to an example of the concept </h3>
          <Switch data={data} dataFn={dataFn} />
        </div>
        <ResponsePanel
          title={title}
          examples={examples}
          properties={properties}
          indexTest={indexTest}
          data={data}
          dataFn={dataFn}
        />
        <ExButton className="btn btn-default" onClick={clickHandler}>
          Submit
        </ExButton>
      </ExContainer>
      {feedback &&
        <ModalSubmit
          properties={properties}
          dataFn={dataFn}
          data={data}
          nbTestFeedback={nbTestFeedback}
        />}
    </ExMain>
  );
};
