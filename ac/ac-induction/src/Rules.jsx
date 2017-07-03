// @flow

import React, { Component } from "react";

class Rules extends Component {
  state: { value: Number };

  constructor(props: { generateNewPics: Function }) {
    super(props);
    this.state = {
      value: 0
    };
  }

  handleOptionChange = e => {
    this.setState({
      value: Number(e.target.value)
    });
  };

  render() {
    //const Rules = ({ goodDef, falseDef }) =>
    //var count = 0;
    return (
      <form onSubmit={this.props.generateNewPics}>
        <div className="radio">
          <label>
            <input
              type="radio"
              value={0}
              onChange={this.handleOptionChange}
              checked={this.state.value === 0}
            />
            {this.props.goodDef}
          </label>
        </div>
        {this.props.falseDef.map((d, index) =>
          <div className="radio" key={index}>
            <label>
              <input
                type="radio"
                value={index + 1}
                onChange={this.handleOptionChange}
                checked={this.state.value === index + 1}
              />
              {d}
            </label>
          </div>
        )}
        <button type="submit">Next</button>
      </form>
    );
  }
}

export default Rules;
