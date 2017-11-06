// @flow

import React from 'react';
import Modal from 'react-modal';
import { stringToArray, arrayMinus, arrayEquals } from '../ArrayFun';
import ImgBis from '../ImgBis';

import {
  ExButton,
  TestCorrectionDiv,
  TestCorrectionCircle
} from '../StyledComponents';

export default ({
  examples,
  properties,
  dataFn,
  data,
  nbTestFeedback
}: Object) => {
  const clickHandler = () => {
    dataFn.objInsert(false, 'feedbackOpen');
    if (data.indexCurrent === nbTestFeedback - 1) {
      dataFn.objInsert(0, 'indexCurrent');
      dataFn.objInsert(data.indexPart + 1, 'indexPart');
    } else {
      dataFn.objInsert(data.indexCurrent + 1, 'indexCurrent');
    }
  };
  const { result, show, propertiesIndex } = data.listIndexTestWithFeedback[
    data.indexCurrent
  ].correction || {
    result: 2,
    show: 0,
    propertiesIndex: []
  };
  return (
    <Modal isOpen={data.feedbackOpen} contentLabel="Modal">
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <div>
            <h1>{'Solution : Example n°' + (data.indexCurrent + 1)}</h1>
            <TestCorrectionDiv>
              <TestCorrectionCircle
                style={{
                  backgroundColor:
                    result === 0
                      ? '#00CC00'
                      : result === 1 ? '#FF9933' : '#CC0000'
                }}
              />
              <h3 style={{ marginLeft: '10px' }}>
                {'Your answer is ' +
                  (result === 0
                    ? 'correct'
                    : result === 1 ? 'almost correct' : 'incorrect')}
              </h3>
            </TestCorrectionDiv>
          </div>
          {result !== 0 && (
            <div>
              {result !== 1 && (
                <div>
                  {'You have selected that this image was ' +
                    data.listIndexTestWithFeedback[data.indexCurrent]
                      .selectedChoice +
                    " but it wasn't"}
                </div>
              )}
              <div>
                You have selected the following properties :
                <ul>
                  {data.listIndexTestWithFeedback[
                    data.indexCurrent
                  ].selectedProperties.map(x => (
                    <li key={x}>{properties[x]}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <div
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            left: '500px'
          }}
        >
          <ImgBis
            url={
              examples[
                data.listIndexTestWithFeedback[data.indexCurrent].realIndex
              ].url
            }
            color="black"
          />
        </div>
      </div>
      {result !== 0 && (
        <ChooseImg
          show={show}
          propertiesIndex={propertiesIndex}
          examples={examples}
        />
      )}
      <ExButton className="btn btn-default" onClick={clickHandler}>
        {data.indexCurrent === nbTestFeedback - 1 ? 'Next part' : 'Next test'}
      </ExButton>
    </Modal>
  );
};

const ChooseImg = ({ show, propertiesIndex, examples }: Object) => {
  const str =
    show < 2
      ? 'An image can be part of the concept and contains the selected properties:'
      : show > 2
        ? 'An image can respect the selected properties and not be part of the concept:'
        : 'An image can be part of the concept but not respect the selected properties:';
  const url = examples
    .filter(y => (show < 3 ? !y.isIncorrect : y.isIncorrect))
    .filter(
      x =>
        show !== 2
          ? arrayMinus(propertiesIndex, stringToArray(x.respectedProperties))
              .length === 0
          : arrayEquals(
              arrayMinus(propertiesIndex, stringToArray(x.respectedProperties)),
              propertiesIndex
            )
    )[0].url;
  return (
    <div style={{ height: '200px', width: '100%' }}>
      {str}
      <ImgBis url={url} color={show !== 3 ? '#00CC00' : '#CC0000'} />
    </div>
  );
};
