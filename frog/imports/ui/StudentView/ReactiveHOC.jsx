// @flow
import * as React from 'react';
import Spinner from 'react-spinner';
import { cloneDeep } from 'lodash';
import {
  generateReactiveFn,
  type ReactComponent,
  getDisplayName,
  uuid
} from 'frog-utils';

import { uploadFile } from '../../api/openUploads';
import { connection } from '../App/connection';

type ReactiveCompPropsT = Object;

type ReactiveCompsStateT = { data: any, dataFn: ?Object, uuid: string };

const ReactiveHOC = (
  docId: string,
  conn?: any,
  transform: Object => Object = x => x,
  readOnly: boolean = false
) => (WrappedComponent: ReactComponent<any>) => {
  class ReactiveComp extends React.Component<
    ReactiveCompPropsT,
    ReactiveCompsStateT
  > {
    state: { data: any, dataFn: ?Object, uuid: string };
    doc: any;
    unmounted: boolean;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: null,
        dataFn: null,
        uuid: uuid()
      };
    }

    componentDidMount = () => {
      this.unmounted = false;
      this.doc = (conn || connection || {}).get('rz', docId);
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
          this.setState({
            dataFn: generateReactiveFn(this.doc, readOnly, this.update)
          });
        }
        this.setState({ data: cloneDeep(this.doc.data) });
        if (readOnly) {
          this.setState({ uuid: uuid() });
        } else {
          window.parent.postMessage(
            {
              type: 'frog-data',
              msg: transform(this.doc.data)
            },
            '*'
          );
        }
      }
    };

    componentWillUnmount = () => {
      this.doc.removeListener('op', this.update);
      this.doc.removeListener('load', this.update);
      this.unmounted = true;
    };

    render = () =>
      this.state.data ? (
        <WrappedComponent
          uuid={this.state.uuid}
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
