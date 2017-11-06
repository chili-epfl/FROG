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
      <Collapse in={choice !== undefined}>
        <div>
          <Panel {...{ ...props, choice }} />
        </div>
      </Collapse>
    </div>
  );
};

const Panel = ({
  title,
  properties,
  feedback,
  tmpList,
  examples,
  dataFn,
  data,
  choice
}: Object) => {
  const even = tmpList[data.indexCurrent].realIndex % 2 === 0;
  const titleBis = choice
    ? 'Select all the properties that make it an example of ' + title
    : even
      ? "Select one property that excludes it from being a '" + title + "'"
      : "Select properties that are missing to be a correct example of '" +
        title +
        "'";
  const array =
    choice || even
      ? stringToArray(
          examples[tmpList[data.indexCurrent].realIndex].respectedProperties
        )
      : properties
          .map((x, i) => i)
          .filter(
            y =>
              !stringToArray(
                examples[tmpList[data.indexCurrent].realIndex]
                  .respectedProperties
              ).includes(y)
          );
  return (
    <div>
      <h4>{titleBis}</h4>
      <TestListDiv>
        {array.map((x, i) => (
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
