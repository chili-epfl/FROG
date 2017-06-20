import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';

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
        <ObservationContainer
          key={y.id}
          setXY={setXY}
          openInfoFn={openInfoFn}
          observation={y}
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
