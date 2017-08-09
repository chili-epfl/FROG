// @flow

import React, { Component } from 'react';
import { shuffle } from 'lodash';

class DecisionPanel extends Component {
  state: { valueState: Array<boolean>, allDef: Array<Object>, selected: boolean };

  constructor(props: {
    trueDef: Object,
    falseDef: Object,
    nextFun: Function,
    whyIncorrect: string,
    style: Object
  }) {
    super(props);

    let defs =
      typeof props.trueDef !== 'undefined'
        ? props.trueDef
            .map(x => ({ def: x, correct: true, wI: false }))
            .concat(props.falseDef.map(x => ({ def: x, correct: false, wI: false})))
        : props.falseDef.map(x => ({ def: x}));
    if(props.whyIncorrect !== undefined)
      defs.push({def: props.whyIncorrect, correct: false, wI: true});

    const newState = [];
    defs.map((d, i) => (newState[i] = false));

    this.state = {
      valueState: newState,
      allDef: shuffle(defs),
      selected: true
    };
  }

  componentWillUpdate(nextProps: Object){
    if(this.props !== nextProps){
      let defs = this.state.allDef.filter(x => !x.wI);
      if(nextProps.whyIncorrect !== undefined)
        defs.push({def: nextProps.whyIncorrect, wI: true});
      defs = shuffle(defs);

      const newState = [];
      defs.map((d, i) => (newState[i] = false));

      this.setState({
        valueState: newState,
        allDef: defs,
        selected: true
      });
    }
  }

  handleOptionChange = (e: { target: { value: number } }) => {
    const newState = [...this.state.valueState];
    newState[e.target.value] = !newState[e.target.value];
    this.setState({ valueState: newState });
  };

  handleSubmit = (e: Event) => {
    e.preventDefault();
    const goodJustif = this.state.selected
      ? this.state.allDef.reduce((acc, x, i) => acc && (x.correct === this.state.valueState[i]), true)
      : this.state.allDef.reduce((acc, x, i) => acc && (x.wI === this.state.valueState[i]), true);
    this.props.nextFun(this.state.selected, goodJustif);
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
          {this.state.allDef.map((x, index) =>
            <div key={index.toString()}>
              <label htmlFor={index.toString()}>
                <input
                  type="checkbox"
                  id={index.toString()}
                  value={index}
                  onChange={this.handleOptionChange}
                  checked={this.state.valueState[index] || false}
                />
                {' ' + x.def.toString()}
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
