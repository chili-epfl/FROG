import React, { Component } from 'react';
import { connection } from '../App/index';
import generateReactiveFn from '../../api/generateReactiveFn';

const getDisplayName = WrappedComponent =>
  WrappedComponent.displayName || WrappedComponent.name || 'Component';

const ReactiveHOC = (dataStructure, docId) => WrappedComponent => {
  class ReactiveComp extends Component {
    constructor(props) {
      super(props);
      this.state = { data: dataStructure };
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
