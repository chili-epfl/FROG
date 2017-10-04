// @flow

import React from 'react';
import { stringToArray } from '../ArrayFun';

export default ({
  title,
  indexTest,
  properties,
  examples,
  dataFn,
  data
}: Object) => {
  const choice = data.testChoice;
  return (
    <div style={{ width: '100%', height: '80%' }}>
      {choice
        ? <TruePanel
            title={title}
            examples={examples}
            properties={properties}
            indexTest={indexTest}
            data={data}
            dataFn={dataFn}
          />
        : <FalsePanel
            title={title}
            examples={examples}
            properties={properties}
            indexTest={indexTest}
            data={data}
            dataFn={dataFn}
          />}
    </div>
  );
};

const TruePanel = ({
  title,
  indexTest,
  properties,
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
      {stringToArray(examples[indexTest].respectedProperties).map(x =>
        <div className="checkbox" key={x}>
          <input
            type="checkbox"
            value=""
            onClick={() => {
              data.selectedProperties.includes(x)
                ? (data.selectedProperties = data.selectedProperties.filter(
                    y => y !== x
                  ))
                : data.selectedProperties.push(x);
            }}
          />
          {properties[x]}
        </div>
      )}
    </div>
  </div>;

const FalsePanel = ({
  title,
  indexTest,
  properties,
  examples,
  dataFn,
  data
}: Object) =>
  <div style={{ width: '100%', height: '100%' }}>
    <h4>
      {"Select properties that exclude him of being an example of the concept '" +
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
      {stringToArray(examples[indexTest].respectedProperties).map(x =>
        <div className="checkbox" key={x}>
          <input
            type="checkbox"
            value=""
            onClick={() => {
              data.selectedProperties.includes(x)
                ? (data.selectedProperties = data.selectedProperties.filter(
                    y => y !== x
                  ))
                : data.selectedProperties.push(x);
            }}
          />
          {properties[x]}
        </div>
      )}
    </div>
    <h4>
      {"Select what would be missing to be an example of the concept '" +
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
      {stringToArray(examples[indexTest].respectedProperties).map(x =>
        <div className="checkbox" key={x}>
          <input
            type="checkbox"
            value=""
            onClick={() => {
              data.selectedProperties.includes(x)
                ? (data.selectedProperties = data.selectedProperties.filter(
                    y => y !== x
                  ))
                : data.selectedProperties.push(x);
            }}
          />
          {properties[x]}
        </div>
      )}
    </div>
  </div>;
