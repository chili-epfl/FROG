// @flow

import React, { Component } from 'react';

class Rules extends Component {
  state: { valueState: Array<boolean> };
  allDef: Array<boolean>;

  constructor(props: {
    generateNewPics: Function,
    trueDef: Object,
    falseDef: Object
  }) {
    super(props);

    this.allDef = this.concatAndShuffle(props.trueDef, props.falseDef);

    const newState = [];
    this.allDef.map((d, i) => (newState[i] = false));

    this.state = {
      valueState: newState
    };
  }

  concatAndShuffle = (a: Object, b: Object) => {
    // Small issue: when no trueDef is entered, the props is not defined at all
    // This doesn't happen with falseDef
    // The following lines still makes it work
    let def = [];
    if (typeof a === 'undefined') def = [...a];
    else def = a.concat(b);

    let j = 0;

    for (let i = def.length; i; i -= 1) {
      j = Math.floor(Math.random() * i);
      const [c, d] = [def[i - 1], def[j]];
      def[j] = c;
      def[i - 1] = d;
    }
    return def;
  };

  handleOptionChange = (e: { target: { value: number } }) => {
    const newState = [...this.state.valueState];
    newState[e.target.value] = !newState[e.target.value];
    this.setState({ valueState: newState });
  };

  render() {
    return (
      <form
        onSubmit={e => this.props.generateNewPics(e)}
        style={{
          marginLeft: '20px'
        }}
      >
        <h4>
          Please select all apropriated definitions
        </h4>
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
