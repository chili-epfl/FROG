// @flow

import React from 'react';
import { Collapse } from 'react-bootstrap';

import { stringToArray } from '../ArrayFun';
import { TestListDiv } from '../StyledComponents';
import Switch from './Switch';

export default (props: Object) => {
  const choice = props.tmpList[props.data.indexCurrent].selectedChoice;

  return (
    <div style={{ width: '100%', height: '80%' }}>
      <h3>This example is a {props.title}</h3>
      <Switch {...props} />
      <Collapse in={choice === true}>
        <div>
          <TruePanel {...props} />
        </div>
      </Collapse>
      <Collapse in={choice === false}>
        <div>
          <FalsePanel {...props} />
        </div>
      </Collapse>
    </div>
  );
};

const TruePanel = ({
  title,
  properties,
  feedback,
  tmpList,
  examples,
  dataFn,
  data
}: Object) => (
  <div>
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
              dataFn.objInsert(
                tmpList[data.indexCurrent].selectedProperties.includes(x)
                  ? tmpList[data.indexCurrent].selectedProperties.filter(
                      y => y !== x
                    )
                  : [...tmpList[data.indexCurrent].selectedProperties, x],
                [
                  feedback ? 'listIndexTestWithFeedback' : 'listIndexTest',
                  data.indexCurrent,
                  'selectedProperties'
                ]
              );
            }}
          />
          {properties[x]}
        </div>
      ))}
    </TestListDiv>
  </div>
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
    <div>
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
                dataFn.objInsert(
                  tmpList[data.indexCurrent].selectedProperties.includes(x)
                    ? tmpList[data.indexCurrent].selectedProperties.filter(
                        y => y !== x
                      )
                    : [...tmpList[data.indexCurrent].selectedProperties, x],
                  [
                    feedback ? 'listIndexTestWithFeedback' : 'listIndexTest',
                    data.indexCurrent,
                    'selectedProperties'
                  ]
                );
              }}
            />
            {properties[x]}
          </div>
        ))}
      </TestListDiv>
    </div>
  );
};
