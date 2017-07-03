// @flow

import React, { Component } from 'react';

class Rules extends Component {
  constructor(props: { callbackFn: Function, def: String, defs: Array}) {
    super(props);
  }

  render() {
    const handleSubmit = e => {
      console.log("test")
    };

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input
            type="radio"
            value="option1"
            checked={true}
          />{def}
        </label>
        {defs.map(d =>
          <label>
            <input
              type="radio"
              value={d}
            />{d}
          </label>
        )
        }

      </form>
    )
  }
}

export default Rules;
