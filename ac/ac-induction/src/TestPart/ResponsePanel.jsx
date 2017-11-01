// @flow

import React from 'react';
import { stringToArray } from '../ArrayFun';
import { Main, TestListDiv } from '../StyledComponents';

export default (props: Object) => (
  <div style={{ width: '100%', height: '80%' }}>
    {props.tmpList[props.data.indexCurrent].selectedChoice ? (
      <TruePanel {...props} />
    ) : (
      <FalsePanel {...props} />
    )}
  </div>
);

const TruePanel = ({
  title,
  properties,
  feedback,
  tmpList,
  examples,
  dataFn,
  data
}: Object) => (
  <Main>
    <h4>Select all the properties that make it an example of {title}</h4>
    <TestListDiv>
      {stringToArray(
        examples[tmpList[data.indexCurrent].realIndex].respectedProperties
      ).map(x => (
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
      ))}
    </TestListDiv>
  </Main>
);

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
    <Main>
      <h4>
        {(even
          ? "Select one property that excludes it from being a '"
          : "Select properties that are missing to be a correct example of '") +
          title +
          "'"}
      </h4>
      <TestListDiv>
        {list.map((x, i) => (
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
        ))}
      </TestListDiv>
    </Main>
  );
};
