// @flow

import React, {Component} from 'react';

export default class End extends Component {

  // constructor(props: Object){
  //   super(props);
  // }

  componentWillMount() {
    this.props.dataFn.objDel({}, ['feedbackOpen']);
  }

  render(){
    console.log(this.props.data);
    return (
      <div style={{ margin: '50px' }}>
        <h2>End of the activity</h2>
      </div>
    );
  }
}

// export default ({ dataFn, data }: Object) =>{
//   dataFn.objDel({}, ['feedbackOpen']);
//
//   console.log(data);
//   return (
//     <div style={{ margin: '50px' }}>
//       <h2>End of the activity</h2>
//     </div>
//   );
// }
