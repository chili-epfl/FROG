// @flow

import React from 'react';
import { stringToArray } from '../ArrayFun';

export default (props: Object) =>
  <div style={{ width: '100%', height: '80%' }}>
    {props.data.testChoice
      ? <TruePanel {...props} />
      : <FalsePanel {...props} />}
  </div>;

const TruePanel = ({
  title,
  properties,
  feedback,
  tmpList,
  examples,
  dataFn,
  data
}: Object) =>
  <div style={{ width: '100%', height: '100%' }}>
    <h4>
      {"Select properties that makes him an example of the concept '" +
        title +
        "'"}
    </h4>
    <div
      style={{
        width: '100%',
        height: 'fit-content',
        textAlign: 'left',
        paddingLeft: '100px'
      }}
    >
      {stringToArray(
        examples[tmpList[data.indexCurrent].realIndex].respectedProperties
      ).map(x =>
        <div className="checkbox" key={x}>
          <input
            type="checkbox"
            checked={
              !!tmpList[data.indexCurrent].selectedProperties.includes(x)
            }
            onClick={() => {
              if (tmpList[data.indexCurrent].selectedProperties.includes(x))
                tmpList[data.indexCurrent].selectedProperties = tmpList[
                  data.indexCurrent
                ].selectedProperties.filter(y => y !== x);
              else
                tmpList[data.indexCurrent].selectedProperties = [
                  ...tmpList[data.indexCurrent].selectedProperties,
                  x
                ];
              dataFn.objInsert(
                tmpList,
                feedback ? 'listIndexTestWithFeedback' : 'listIndexTest'
              );
            }}
          />
          {properties[x]}
        </div>
      )}
    </div>
  </div>;

const FalsePanel = ({
  title,
  properties,
  feedback,
  tmpList,
  examples,
  dataFn,
  data
}: Object) =>
  <div style={{ width: '100%', height: '100%' }}>
    <h4>
      {(tmpList[data.indexCurrent].realIndex % 2 === 0
        ? "Select properties that exclude him of being an example of the concept '"
        : "Select what would be missing to be an example of the concept '") +
        title +
        "'"}
    </h4>
    <div
      style={{
        width: '100%',
        height: 'fit-content',
        textAlign: 'left',
        paddingLeft: '100px'
      }}
    >
      {stringToArray(
        examples[tmpList[data.indexCurrent].realIndex].respectedProperties
      ).map(x =>
        <div className="checkbox" key={x}>
          <input
            type="checkbox"
            checked={
              !!tmpList[data.indexCurrent].selectedProperties.includes(x)
            }
            onClick={() => {
              if (tmpList[data.indexCurrent].selectedProperties.includes(x))
                tmpList[data.indexCurrent].selectedProperties = tmpList[
                  data.indexCurrent
                ].selectedProperties.filter(y => y !== x);
              else
                tmpList[data.indexCurrent].selectedProperties = [
                  ...tmpList[data.indexCurrent].selectedProperties,
                  x
                ];
              dataFn.objInsert(
                tmpList,
                feedback ? 'listIndexTestWithFeedback' : 'listIndexTest'
              );
            }}
          />
          {properties[x]}
        </div>
      )}
    </div>
  </div>;
