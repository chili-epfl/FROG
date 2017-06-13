import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Stringify from 'json-stable-stringify';
import styled from 'styled-components';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100vh;
`;

const colors = {
  a: '#e7ffac',
  b: '#fbe4ff',
  c: '#dcd3ff',
  d: '#ffccf9'
};

const Item = styled.div`
  width: 50%;
  background: ${props => colors[props.group]}
`;

class Cluster extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const List = this.props.data.map((y, i) => {
      const openInfoFn = () => this.setState({ info: y });
      const setXY = (_, draggable) => {
        const newObj = {
          ...y,
          x: y.x + draggable.position.left || 1,
          y: y.y + draggable.position.top || 1
        };
        this.props.dataFn.listReplace(y, newObj, i);
      };

      return (
        <Container>
          <Item group="a">{this.props.configData.quadrant1}</Item>
          <Item group="b">{this.props.configData.quadrant2}</Item>
          <Item group="c">{this.props.configData.quadrant3}</Item>
          <Item group="d">{this.props.configData.quadrant4}</Item>
          <ObservationContainer
            key={i}
            setXY={setXY}
            openInfoFn={openInfoFn}
            observation={y}
          />
        </Container>
      );
    });

    return (
      <MuiThemeProvider>

        <div>
          {List}
          {this.state.info
            ? <ObservationDetail
                observation={this.state.info}
                closeInfoFn={() => this.setState({ info: null })}
              />
            : null}
        </div>

      </MuiThemeProvider>
    );
  }
}

export default Cluster;
