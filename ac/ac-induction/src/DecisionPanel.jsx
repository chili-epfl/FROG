// @flow

import React from 'react';
import { shuffle } from 'lodash';
import type { dataUnitStructT } from 'frog-utils';

export default (props: {
  style: Object,
  activityData: dataUnitStructT,
  data: any,
  dataFn: Object
}) => {
  const currentEx =
    props.activityData.config.examples[props.data.listIndex[props.data.index]];

  const handleOptionChange = (e: { target: { value: number } }) => {
    if (!props.data.transitState) {
      const newState = [...props.data.currentValueState];
      newState[e.target.value] = !newState[e.target.value];
      props.dataFn.objInsert(newState, 'currentValueState');
    }
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const goodJustif = props.data.currentSelected
      ? props.data.currentDefs.reduce(
          (acc, x, i) =>
            acc &&
            props.activityData.config.trueDef.includes(x) ===
              props.data.currentValueState[i],
          true
        )
      : props.data.currentDefs.reduce(
          (acc, x, i) =>
            acc &&
            (x === currentEx.whyIncorrect) === props.data.currentValueState[i],
          true
        );

    const incorrect =
      currentEx.isIncorrect === undefined ? false : currentEx.isIncorrect;

    const answer = {
      wasCorrect: !incorrect,
      wellJustified: goodJustif,
      reconnized: false
    };
    let color = '#00FF00';
    if (incorrect === props.data.currentSelected) {
      color = '#FF0000';
    } else {
      color = goodJustif ? '#00FF00' : '#FF9933';
      answer.reconnized = true;
    }

    props.dataFn.objInsert(color, 'transitStateColor');
    props.dataFn.objInsert(answer, props.data.index);
    props.dataFn.objInsert(true, 'transitState');
  };

  const nextHandler = () => {
    props.dataFn.objInsert(false, 'transitState');
    props.dataFn.objInsert(props.data.index + 1, 'index');
    const tmp =
      props.activityData.config.examples[
        props.data.listIndex[props.data.index]
      ];

    if (tmp !== undefined) {
      const genDefs = props.activityData.config.trueDef.concat(
        props.activityData.config.falseDef
      );

      if (tmp.whyIncorrect !== undefined) genDefs.push(tmp.whyIncorrect);

      props.dataFn.objInsert(shuffle(genDefs), 'currentDefs');
      props.dataFn.objInsert(genDefs.map(() => false), 'currentValueState');
      props.dataFn.objInsert(true, 'currentSelected');
      props.dataFn.objInsert('#00FF00', 'transitStateColor');
    } else {
      props.dataFn.objDel('', 'currentDefs');
      props.dataFn.objDel('', 'currentValueState');
      props.dataFn.objDel('', 'currentSelected');
      props.dataFn.objDel('', 'transitState');
      props.dataFn.objDel('', 'transitStateColor');
    }
  };

  const onClickSwitch = () => {
    if (!props.data.transitState)
      props.dataFn.objInsert(!props.data.currentSelected, 'currentSelected');
  };

  const computeCorrection = () => {
    let tmpStr = '';
    const i = props.data.index;
    if (props.data[i].reconnized && props.data[i].wellJustified)
      tmpStr = 'Correct';
    else if (props.data[i].reconnized && !props.data[i].wellJustified)
      tmpStr = 'Correct but wrong justifications. You should have selected :\n';
    else
      tmpStr =
        'Incorrect: the example was ' +
        !currentEx.isIncorrect +
        ' and the justifications should have been ';

    return (
      <div>
        {tmpStr}
        {tmpStr !== 'Correct' && (
          <ul>
            {currentEx.isIncorrect ? (
              <li> {currentEx.whyIncorrect} </li>
            ) : (
              props.activityData.config.trueDef.map(x => (
                <li key={x}>
                  {x}
                  <br />
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    );
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
            backgroundColor: !props.data.currentSelected
              ? '#CC0000'
              : '#E0E0E0',
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
      {props.data.listIndex[props.data.index] !== undefined && (
        <form onSubmit={handleSubmit}>
          <h4>Why so ?</h4>
          {props.data.currentDefs.map((x, index) => (
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
          ))}
          {!props.data.transitState && (
            <button className="btn btn-default" type="submit">
              Submit
            </button>
          )}
        </form>
      )}

      {props.data.transitState && (
        <div>
          <br />
          <div
            style={{
              border: 'solid 3px',
              borderColor: props.data.transitStateColor,
              borderRadius: '10px',
              padding: '5px',
              width: 'fit-content'
            }}
          >
            {computeCorrection()}
          </div>
          <br />
          <button className="btn btn-default" onClick={nextHandler}>
            {' '}
            Next <span className="glyphicon glyphicon-chevron-right" />{' '}
          </button>
        </div>
      )}
    </div>
  );
};
