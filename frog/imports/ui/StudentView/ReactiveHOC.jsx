// @flow

import React, { Component } from 'react';
import { connection } from '../App/index';
import generateReactiveFn from '../../api/generateReactiveFn';

const getDisplayName = (WrappedComponent: any): string => {
  if (typeof WrappedComponent.displayName === 'string') {
    return WrappedComponent.displayName;
  } else if (typeof WrappedComponent.name === 'string') {
    return WrappedComponent.name;
  } else {
    return 'Component';
  }
};

const ReactiveHOC = (dataStructure: any, docId: string) => (
  WrappedComponent: Class<Component<*, *, *>>
) => {
  class ReactiveComp extends Component {
    state: { data: any, dataFn: Object };
    doc: any;
    timeout: ?number;
    unmounted: boolean;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: dataStructure,
        dataFn: {}
      };
    }

    componentDidMount = () => {
      this.doc = connection.get('rz', docId);
      this.doc.subscribe();
      this.doc.on('ready', this.update);
      this.doc.on('op', this.update);
      this.waitForDoc();
    };

    waitForDoc = () => {
      if (this.doc.type) {
        this.timeout = undefined;
        this.update();
      } else {
        this.timeout = window.setTimeout(this.waitForDoc, 100);
      }
    };

    update = () => {
      if (!this.timeout && !this.unmounted) {
        if (!this.state.dataFn) {
          this.setState({ dataFn: generateReactiveFn(this.doc) });
        }
        this.setState({ data: this.doc.data });
      }
    };

    componentWillUnmount = () => {
      this.doc.destroy();
      if (this.timeout) {
        window.clearTimeout(this.timeout);
      }
      this.unmounted = true;
    };

    render = () =>
      <WrappedComponent
        dataFn={this.state.dataFn}
        data={this.state.data}
        {...this.props}
      />;
  }
  ReactiveComp.displayName = `ReactiveHOC(${getDisplayName(WrappedComponent)})`;
  return ReactiveComp;
};

export default ReactiveHOC;
