// @flow

import React from 'react';
import { stringToArray } from '../ArrayFun';

export default (props: Object) =>
  <div style={{ width: '100%', height: '80%' }}>
    {props.tmpList[props.data.indexCurrent].selectedChoice
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
            onChange={() => {
              const newList = [...tmpList];
              if (newList[data.indexCurrent].selectedProperties.includes(x))
                newList[data.indexCurrent].selectedProperties = newList[
                  data.indexCurrent
                ].selectedProperties.filter(y => y !== x);
              else
                newList[data.indexCurrent].selectedProperties = [
                  ...newList[data.indexCurrent].selectedProperties,
                  x
                ];
              dataFn.objInsert(
                newList,
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
}: Object) => {
  const even = tmpList[data.indexCurrent].realIndex % 2 === 0;
  const arr = stringToArray(
    examples[tmpList[data.indexCurrent].realIndex].respectedProperties
  );
  const list = even
    ? arr
    : properties.map((x, i) => i).filter(y => !arr.includes(y));
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <h4>
        {(even
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
        {list.map((x, i) =>
          <div className="checkbox" key={x + i.toString()}>
            <input
              type="checkbox"
              checked={
                !!tmpList[data.indexCurrent].selectedProperties.includes(x)
              }
              onChange={() => {
                const newList = [...tmpList];
                if (newList[data.indexCurrent].selectedProperties.includes(x))
                  newList[data.indexCurrent].selectedProperties = newList[
                    data.indexCurrent
                  ].selectedProperties.filter(y => y !== x);
                else
                  newList[data.indexCurrent].selectedProperties = [
                    ...newList[data.indexCurrent].selectedProperties,
                    x
                  ];
                dataFn.objInsert(
                  newList,
                  feedback ? 'listIndexTestWithFeedback' : 'listIndexTest'
                );
              }}
            />
            {properties[x]}
          </div>
        )}
      </div>
    </div>
  );
};
