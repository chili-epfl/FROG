import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import styled from 'styled-components';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';

class Cluster extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { config } = this.props.activityData;
    const { data, dataFn } = this.props;
    const List = data.map((y, i) => {
      const openInfoFn = () => this.setState({ info: y });
      const setXY = (_, draggable) => {
        const newObj = {
          ...y,
          x: y.x + draggable.position.left || 1,
          y: y.y + draggable.position.top || 1
        };
        dataFn.listReplace(y, newObj, i);
      };

      return (
        <Container>
          {config.quadrants
            ? [
                <Item group="a">
                  {config.quadrant1}
                </Item>,
                <Item group="b">
                  {config.quadrant2}
                </Item>,
                <Item group="c">
                  {config.quadrant3}
                </Item>,
                <Item group="d">
                  {config.quadrant4}
                </Item>
              ]
            : null}
          <ObservationContainer
            key={y.id}
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
