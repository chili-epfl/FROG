// @flow

import React, { Component } from 'react';
import { shuffle } from 'lodash';

class Rules extends Component {
  state: { valueState: Array<boolean> };
  allDef: Array<boolean>;

  constructor(props: {
    generateNewPics: Function,
    trueDef: Object,
    falseDef: Object,
    style: Object
  }) {
    super(props);

    const def = typeof props.trueDef !== 'undefined'
      ? props.trueDef.concat(props.falseDef)
      : [];

    this.allDef = shuffle(def);

    const newState = [];
    this.allDef.map((d, i) => (newState[i] = false));

    this.state = {
      valueState: newState
    };
  }

  handleOptionChange = (e: { target: { value: number } }) => {
    const newState = [...this.state.valueState];
    newState[e.target.value] = !newState[e.target.value];
    this.setState({ valueState: newState });
  };

  render() {
    return (
      <form
        onSubmit={e => this.props.generateNewPics(e)}
        style={this.props.style}
      >
        <h4>Please select all apropriated definitions</h4>
        {this.allDef.map((d, index) =>
          <div key={index.toString()}>
            <label htmlFor={index.toString()}>
              <input
                type="checkbox"
                id={index.toString()}
                value={index}
                onChange={this.handleOptionChange}
                checked={this.state.valueState[index] || false}
              />
              {' ' + d.toString()}
            </label>
          </div>
        )}

        <button type="submit">Next</button>
      </form>
    );
  }
}

export default Rules;
