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

const ReactiveHOC = (docId: string, conn?: any) => (
  WrappedComponent: ReactComponent<any>
) => {
  class ReactiveComp extends Component {
    state: { data: any, dataFn: ?Object };
    doc: any;
    unmounted: boolean;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: null,
        dataFn: null
      };
    }

    componentDidMount = () => {
      this.unmounted = false;
      this.doc = (conn || connection).get('rz', docId);
      this.doc.setMaxListeners(30);
      this.doc.subscribe();
      if (this.doc.type) {
        console.warn('doctype initial');
        this.update();
      } else {
        this.doc.on('load', this.update);
      }
      this.doc.on('op', this.update);
    };

    update = () => {
      console.warn('update', this.doc.type, this.doc.data);
      if (!this.unmounted) {
        if (!this.state.dataFn) {
          this.setState({ dataFn: generateReactiveFn(this.doc) });
        }
        this.setState({ data: this.doc.data });
      }
    };

    componentWillUnmount = () => {
      this.doc.removeListener('op', this.update);
      this.doc.removeListener('load', this.update);
      this.unmounted = true;
    };

    render = () =>
      this.state.data !== null ? (
        <WrappedComponent
          dataFn={this.state.dataFn}
          uploadFn={uploadFile}
          data={this.state.data}
          {...this.props}
        />
      ) : (
        <Spinner />
      );
  }
  ReactiveComp.displayName = `ReactiveHOC(${getDisplayName(WrappedComponent)})`;
  return ReactiveComp;
};

export default ReactiveHOC;
