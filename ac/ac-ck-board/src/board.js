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
    window.simulateDragObs = (sel, toX, toY) => {
      const obs = this.props.reactiveData.list.find(x => x.value.title === sel);
      const e = { ...obs.value, _id: obs._id };
      const distX = (toX - e.x) / 200;
      const distY = (toY - e.y) / 200;

      const that = this;
      Array(199).fill().map((_, x) =>
        window.setTimeout(() => {
          that.props.reactiveFn('EVERYONE').listSet(e._id, {
            ...e,
            x: e.x + distX * (x + 1),
            y: e.y + distY * (x + 1)
          });
        }, x * 10)
      );
    };

    if (this.props.configData) {
      this.props.configData.boxes.forEach(e => {
        const id = Stringify(e);
        this.props.reactiveFn('EVERYONE').listAddNoClobber(id, {
          ...e,
          x: Math.random() * 800,
          y: Math.random() * 800
        });
      });
    }

    if (this.props.object.products.length > 0) {
      this.props.object.products[0].forEach(e => {
        const id = Stringify(e.data);
        this.props.reactiveFn('EVERYONE').listAddNoClobber(id, {
          ...e.data,
          x: Math.random() * 800,
          y: Math.random() * 800
        });
      });
    }
  }

  render() {
    const List = this.props.reactiveData.list.map(y => {
      const e = { ...y.value, _id: y._id };
      const openInfoFn = () => this.setState({ info: e });
      const setXY = (_, draggable) => {
        this.props.reactiveFn('EVERYONE').listSet(e._id, {
          ...e,
          x: e.x + draggable.position.left || 1,
          y: e.y + draggable.position.top || 1
        });
      };

      return (
        <Container>
          <Item group="a">Consumer Protection</Item>
          <Item group="b">Fairness to taxi drivers</Item>
          <Item group="c">Existing laws</Item>
          <Item group="d">Supporting innovation</Item>

          <ObservationContainer
            key={e._id}
            setXY={setXY}
            openInfoFn={openInfoFn}
            observation={e}
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
