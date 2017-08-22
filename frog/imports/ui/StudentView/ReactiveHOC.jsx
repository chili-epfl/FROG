// @flow

import React, { Component } from 'react';
import { generateReactiveFn } from 'frog-utils';
import { cloneDeep } from 'lodash';

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

const ReactiveHOC = (
  dataStructure: any,
  docId: string,
  previewActivity: any = false,
  previewActivityData: any = null,
) => (WrappedComponent: Class<Component<*, *, *>>) => {
  class ReactiveComp extends Component {
    state: { data: any, dataFn: ?Object };
    doc: any;
    timeout: ?number;
    unmounted: boolean;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: null,
        dataFn: null,
      };
    }

    componentDidMount = () => {
      this.doc = connection.get('rz', docId);
      this.doc.subscribe();
      if (previewActivity !== false) {
        this.doc.on('load', () => {
          if (!this.doc.type) {
            this.doc.create(previewActivity.dataStructure || {});
            if (previewActivity.mergeFunction) {
              const dataFn = generateReactiveFn(this.doc);
              previewActivity.mergeFunction(
                cloneDeep(previewActivityData),
                dataFn,
              );
            }
            this.waitForDoc();
          }
        });
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
            uploadFn={{ uploadFile }}
            data={this.state.data}
            {...this.props}
          />
        : <p>Loading...</p>;
  }
  ReactiveComp.displayName = `ReactiveHOC(${getDisplayName(WrappedComponent)})`;
  return ReactiveComp;
};

export default ReactiveHOC;
