// @flow
import React, { Component } from 'react';
import { generateReactiveFn, type ReactComponent } from 'frog-utils';
import Spinner from 'react-spinner';

import { uploadFile } from '../../api/openUploads';
import { connection } from '../App/index';

const getDisplayName = (WrappedComponent: any): string => {
  if (typeof WrappedComponent.displayName === 'string') {
    return WrappedComponent.displayName;
  } else if (typeof WrappedComponent.name === 'string') {
    return WrappedComponent.name;
  } else {
    return 'Component';
  }
};

const ReactiveHOC = (docId: string, doc?: any) => (
  WrappedComponent: ReactComponent<any>
) => {
  class ReactiveComp extends Component {
    state: { data: any, dataFn: ?Object };
    doc: any;
    timeout: ?number;
    unmounted: boolean;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: null,
        dataFn: null
      };
    }

    componentDidMount = () => {
      if (!doc) {
        this.doc = connection.get('rz', docId);
        this.doc.subscribe();
      } else {
        this.doc = doc;
      }
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
      this.state.data !== null
        ? <WrappedComponent
            dataFn={this.state.dataFn}
            uploadFn={uploadFile}
            data={this.state.data}
            {...this.props}
          />
        : <Spinner />;
  }
  ReactiveComp.displayName = `ReactiveHOC(${getDisplayName(WrappedComponent)})`;
  return ReactiveComp;
};

export default ReactiveHOC;
