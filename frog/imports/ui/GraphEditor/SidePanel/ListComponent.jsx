// @flow

import React, { Component } from 'react';

class ListComponent extends Component {
  state: { longDesc: boolean, over1: boolean, over2: boolean };
  constructor(props: any) {
    super(props);
    this.state = {
      longDesc: false,
      over1: false,
      over2: false
    };
  }

  render() {
    const obj = this.props.object;

    const click = () => this.setState({ longDesc: !this.state.longDesc });

    return (
      <div className="list-group-item">
        <h5 style={{ fontWeight: 'bold' }}>
          {obj.meta.name}
        </h5>
        <button
          value={obj.id}
          style={{
            position: 'absolute',
            right: '2px',
            top: '4px',
            width: '13%',
            height: '35px'
          }}
        >
          {' '}Choose{' '}
        </button>
        <button
          style={{
            position: 'absolute',
            right: '2px',
            top: '38px',
            width: '13%',
            height: '35px'
          }}
          className={
            this.state.longDesc
              ? 'glyphicon glyphicon-minus'
              : 'glyphicon glyphicon-plus'
          }
          onClick={click}
        />
        {!this.state.longDesc &&
          <div style={{ width: '87%' }}>
            {obj.meta.shortDesc}{' '}
          </div>}
        {this.state.longDesc &&
          <div style={{ width: '87%' }}>
            {obj.meta.description}{' '}
          </div>}
      </div>
    );
  }
}

export default ListComponent;
