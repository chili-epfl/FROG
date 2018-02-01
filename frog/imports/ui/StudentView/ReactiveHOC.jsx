// @flow
import React, { Component } from 'react';
import Spinner from 'react-spinner';
import { cloneDeep } from 'lodash';
import {
  generateReactiveFn,
  type ReactComponent,
  getDisplayName
} from 'frog-utils';

import { uploadFile } from '../../api/openUploads';
import { connection } from '../App/index';

type ReactiveCompPropsT = Object

type ReactiveCompsStateT = { data: any, dataFn: ?Object }

const ReactiveHOC = (docId: string, conn?: any) => (
  WrappedComponent: ReactComponent<any>
) => {
  class ReactiveComp extends Component<ReactiveCompPropsT, ReactiveCompsStateT> {
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
        this.update();
      } else {
        this.doc.on('load', this.update);
      }
      this.doc.on('op', this.update);
    };

    update = () => {
      if (!this.unmounted) {
        if (!this.state.dataFn) {
          this.setState({ dataFn: generateReactiveFn(this.doc) });
        }
        this.setState({ data: cloneDeep(this.doc.data) });
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
