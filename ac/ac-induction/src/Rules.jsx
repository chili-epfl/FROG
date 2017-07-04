// @flow

import React, { Component } from "react";

class Rules extends Component {
  state: { valueState: Array };

  constructor(props: { generateNewPics: Function }) {
    super(props);

    var newState = [false];
    var def = this.props.falseDef;
    for (var i: 1; i < def.length; ++i) {
      newState = [...newState, false];
    }
    this.state = {
      valueState: newState
    };
  }

  handleOptionChange = e => {
    var newState = [...this.state.valueState];
    newState[e.target.value] = newState[e.target.value] ? false : true;

    this.setState({ valueState: newState });
  };

  render() {
    return (
      <form onSubmit={this.props.generateNewPics}>
        <label>
          <input
            type="checkbox"
            value={0}
            onChange={this.handleOptionChange}
            checked={this.state.valueState[0]}
          />
          {" " + this.props.goodDef}
        </label>
        {this.props.falseDef.map((d, index) =>
          <div className="chkbx" key={index}>
            <label>
              <input
                type="checkbox"
                value={index + 1}
                onChange={this.handleOptionChange}
                checked={this.state.valueState[index + 1]}
              />
              {" " + d}
            </label>
          </div>
        )}
        <button type="submit">Next</button>
      </form>
    );
  }
}

export default Rules;
