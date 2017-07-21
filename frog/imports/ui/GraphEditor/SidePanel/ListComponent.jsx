// @flow

import React, { Component } from 'react';

class ListComponent extends Component {
  state: { over: boolean };
  constructor(props: any) {
    super(props);
    this.state = {
      over: false
    };
  }

  render() {
    const obj = this.props.object;
    const inp = obj.meta.inputs === '' ? '' : 'Inputs : ' + obj.meta.inputs;
    const InOut = () => (inp !== '' && outp !== '' ? <br /> : <div />);
    const outp = obj.meta.outputs === '' ? '' : 'Outputs : ' + obj.meta.outputs;

    const onOver = () => this.setState({ over: true });
    const onOut = () => this.setState({ over: false });

    return (
      <div value="titi" className="list-group-item">
        <h5 style={{ fontWeight: 'bold' }}>
          {' '}{obj.meta.name}{' '}
        </h5>
        {this.state.over &&
          <div>
            <p>
              {' '}{obj.meta.description}{' '}
            </p>
            <i>
              {inp}
              <InOut />
              {outp}
            </i>
          </div>}
        <div
          onMouseOver={onOver}
          onMouseOut={onOut}
          value={obj.id}
          style={{
            position: 'absolute',
            left: '0px',
            top: '0px',
            backgroundColor: this.state.over ? '#0066CC' : '#FFFFFF',
            opacity: this.state.over ? '0.3' : '0',
            width: '100%',
            height: '100%'
          }}
        />
      </div>
    );
  }
}

export default ListComponent;
