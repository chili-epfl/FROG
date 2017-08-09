// @flow

import React, { Component } from 'react';
import { shuffle } from 'lodash';

class DecisionPanel extends Component {
  state: { valueState: Array<boolean>, selected: boolean };
  allDef: Array<Object>;

  constructor(props: {
    trueDef: Object,
    falseDef: Object,
    nextFun: Function,
    style: Object
  }) {
    super(props);

    const defs =
      typeof props.trueDef !== 'undefined'
        ? props.trueDef
            .map(x => ({ def: x, correct: true }))
            .concat(props.falseDef.map(x => ({ def: x, correct: false })))
        : props.falseDef.map(x => ({ def: x, correct: false }));

    this.allDef = shuffle(defs);

    const newState = [];
    this.allDef.map((d, i) => (newState[i] = false));

    this.state = {
      valueState: newState,
      selected: true
    };
  }

  handleOptionChange = (e: { target: { value: number } }) => {
    const newState = [...this.state.valueState];
    newState[e.target.value] = !newState[e.target.value];
    this.setState({ valueState: newState });
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    const choosen = this.state.selected;
    let goodJustif = false;
    if (choosen) {
      goodJustif = this.allDef.reduce(
        (acc, x, i) => acc && x.correct === this.state.valueState[i],
        true
      );
    } else {
      const noTCheckedNoFChecked = this.allDef.reduce(
        (acc, x, i) =>
          x.correct
            ? [acc[0] && !this.state.valueState[i], acc[1]]
            : [acc[0], acc[1] && !this.state.valueState[i]],
        [true, true]
      );
      goodJustif = noTCheckedNoFChecked[0] && !noTCheckedNoFChecked[1];
    }
    this.props.nextFun(choosen, goodJustif);
  };

  render() {
    return (
      <div style={this.props.style}>
        <h4> This is an example that corresponds to the concept </h4>
        <div className="btn-group" role="group" aria-label="...">
          <button
            className="btn btn-default"
            style={{
              backgroundColor: this.state.selected ? '#66CC00' : '#E0E0E0',
              width: this.state.selected ? '80px' : '8px',
              outline: 'none',
              height: '30px'
            }}
            tabIndex="-1"
            onClick={() => this.setState({ selected: !this.state.selected })}
          >
            {this.state.selected ? 'True' : ''}
          </button>
          <button
            className="btn btn-default"
            style={{
              backgroundColor: !this.state.selected ? '#CC0000' : '#E0E0E0',
              width: !this.state.selected ? '80px' : '8px',
              outline: 'none',
              height: '30px'
            }}
            tabIndex="-1"
            onClick={() => this.setState({ selected: !this.state.selected })}
          >
            {!this.state.selected ? 'False' : ''}
          </button>
        </div>
        <form onSubmit={this.handleSubmit}>
          <h4>Why so ?</h4>
          {this.allDef.map(({ def, correct }, index) =>
            <div key={index.toString()}>
              <label htmlFor={index.toString()}>
                <input
                  type="checkbox"
                  id={index.toString()}
                  value={index}
                  onChange={this.handleOptionChange}
                  checked={this.state.valueState[index] || false}
                />
                {' ' + def.toString()}
              </label>
            </div>
          )}

          <button type="submit">Next</button>
        </form>
      </div>
    );
  }
}

export default DecisionPanel;
