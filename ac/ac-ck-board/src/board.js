import React, { Component } from 'react';
import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { map } from 'lodash'

class Cluster extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    if(!(this.props.reactiveData.key && this.props.reactiveData.key.imported)) { 
      this.props.data.map(e => this.props.reactiveFn.listAdd(e))
      this.props.reactiveFn.keySet('imported', true)
    }
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
