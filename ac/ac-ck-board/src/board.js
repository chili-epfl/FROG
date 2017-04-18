import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Stringify from 'json-stable-stringify';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';

class Cluster extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (this.props.configData) {
      this.props.configData.boxes.forEach(e => {
        const id = Stringify(e);
        this.props
          .reactiveFn('EVERYONE')
          .listAddNoClobber(id, { ...e, x: 1, y: 1 });
      });
    }

    console.log(this.props.object.products[0])
    if(this.props.object.products.length > 0) {
      this.props.object.products[0].forEach(e => {
        const id = Stringify(e.data);
        this.props
          .reactiveFn('EVERYONE')
          .listAddNoClobber(id, { ...e.data, x: 1, y: 1 });
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
        <ObservationContainer
          key={e._id}
          setXY={setXY}
          openInfoFn={openInfoFn}
          observation={e}
        />
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
