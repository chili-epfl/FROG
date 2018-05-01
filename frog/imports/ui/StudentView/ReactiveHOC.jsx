// @flow
import * as React from 'react';
import Spinner from 'react-spinner';
import { cloneDeep } from 'lodash';
import { generateReactiveFn, getDisplayName, uuid } from 'frog-utils';
import { ErrorBoundary } from '../App/ErrorBoundary';

import { uploadFile } from '../../api/openUploads';
import { connection } from '../App/connection';

type ReactiveCompPropsT = Object;

type ReactiveCompsStateT = {
  data: any,
  dataFn: ?Object,
  uuid: string,
  timeout: boolean
};

const ReactiveHOC = (
  docId: string,
  conn?: any,
  transform: Object => Object = x => x,
  readOnly: boolean = false
) => (WrappedComponent: React.ComponentType<*>) => {
  class ReactiveComp extends React.Component<
    ReactiveCompPropsT,
    ReactiveCompsStateT
  > {
    doc: any;
    unmounted: boolean;
    interval: any;
    times: 0;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: null,
        dataFn: null,
        uuid: uuid(),
        timeout: false
      };
    }

    componentDidMount = () => {
      this.unmounted = false;
      this.doc = (conn || connection || {}).get('rz', docId);
      this.doc.setMaxListeners(30);
      this.doc.subscribe();
      this.interval = window.setInterval(() => {
        this.interval += 1;
        if (this.interval > 10) {
          this.setState({ timeout: true });
          window.clearInterval(this.interval);
          this.interval = undefined;
        } else {
          this.update();
        }
      }, 1000);
      if (this.doc.type) {
        this.update();
      } else {
        this.doc.on('load', () => {
          this.update();
        });
      }
      this.doc.on('op', () => {
        this.update();
      });
    };

    update = () => {
      if (!this.unmounted) {
        if (!this.state.dataFn) {
          this.setState({
            dataFn: generateReactiveFn(this.doc, readOnly, this.update)
          });
        }
        if (this.doc.data !== undefined) {
          this.setState({ data: cloneDeep(this.doc.data) });
          if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = undefined;
          }
        }
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
      if (this.interval) {
        window.clearInterval(this.interval);
      }
    };

    render = () =>
      this.state.timeout ? (
        <h1>Sorry, reactive data timed out. Try reloading the page</h1>
      ) : this.state.data ? (
        <ErrorBoundary msg="Activity crashed, try reloading">
          <WrappedComponent
            uuid={this.state.uuid}
            dataFn={this.state.dataFn}
            uploadFn={uploadFile}
            data={this.state.data}
            {...this.props}
          />
        </ErrorBoundary>
      ) : (
        <Spinner />
      );
  }
  ReactiveComp.displayName = `ReactiveHOC(${getDisplayName(WrappedComponent)})`;
  return ReactiveComp;
};

export default ReactiveHOC;
