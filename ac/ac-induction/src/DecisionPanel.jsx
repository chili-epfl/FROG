// @flow

import React, { Component } from 'react';
import { shuffle } from 'lodash';

export default (props: {style: Object, nextFun: Function, data: Object, dataFn: Object}) => {
  const currentEx = props.activityData.config.examples[props.data.listIndex[props.data.index]];

  const handleOptionChange = (e: { target: { value: number } }) => {
    const newState = [...props.data.currentValueState];
    newState[e.target.value] = !newState[e.target.value];
    props.dataFn.objInsert(newState, 'currentValueState');
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const goodJustif = props.data.currentSelected
      ? props.data.currentDefs.reduce(
          (acc, x, i) => acc && (props.activityData.config.trueDef.includes(x)) === props.data.currentValueState[i],
          true
        )
      : props.data.currentDefs.reduce(
          (acc, x, i) => acc && (currentEx.whyIncorrect === x) === props.data.currentValueState[i],
          true
        );
    props.nextFun(props.data.currentSelected, goodJustif);
  };

  const onClickSwitch = () => {
    props.dataFn.objInsert(!props.data.currentSelected, 'currentSelected');
  };

  return (
    <div style={props.style}>
      <h4> This is an example that corresponds to the concept </h4>
      <div className="btn-group" role="group" aria-label="...">
        <button
          className="btn btn-default"
          style={{
            backgroundColor: props.data.currentSelected ? '#66CC00' : '#E0E0E0',
            width: props.data.currentSelected ? '80px' : '8px',
            outline: 'none',
            height: '30px'
          }}
          tabIndex="-1"
          onClick={onClickSwitch}
        >
          {props.data.currentSelected ? 'True' : ''}
        </button>
        <button
          className="btn btn-default"
          style={{
            backgroundColor: !props.data.currentSelected ? '#CC0000' : '#E0E0E0',
            width: !props.data.currentSelected ? '80px' : '8px',
            outline: 'none',
            height: '30px'
          }}
          tabIndex="-1"
          onClick={onClickSwitch}
        >
          {!props.data.currentSelected ? 'False' : ''}
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <h4>Why so ?</h4>
        {props.data.currentDefs.map((x, index) =>
          <div key={index.toString()}>
            <label htmlFor={index.toString()}>
              <input
                type="checkbox"
                id={index.toString()}
                value={index}
                onChange={handleOptionChange}
                checked={props.data.currentValueState[index] || false}
              />
              {' ' + x.toString()}
            </label>
          </div>
        )}

        <button type="submit">Next</button>
      </form>

    </div>);
};
