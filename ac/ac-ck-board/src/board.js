import React, { Component } from 'react';
import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Stringify from 'json-stable-stringify'
import { map } from 'lodash'

class Cluster extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.props.data.forEach(e => {
      const id = Stringify(e)
      this.props.reactiveFn.listAddNoClobber(id, e)
    })
  }

  render() { 

    const List = this.props.reactiveData.list.map(y => {
      const e = {...y.value, _id: y._id}
      const openInfoFn = () => this.setState({info: e})

      const move = (id, left, top) => this.props.reactiveFn.listSet(id, {...e, x: left, y: top})
      const setXY = (_, draggable) => {
        move(e._id, e.x + draggable.position.left, e.y + draggable.position.top)
      }

      return (
        <ObservationContainer
          key = {e._id}
          setXY={setXY}
          openInfoFn = {openInfoFn}
          observation = {e} />
      )
    })

    return (
      <MuiThemeProvider>

        <div>
          {List}
          { this.state.info ? 
              <ObservationDetail 
                observation = { this.state.info }
                closeInfoFn = { () => this.setState({info: null}) } /> :
              null
          }
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Cluster
