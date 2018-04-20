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
) => (WrappedComponent: ReactComponent<any>) => {
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
        console.info('Interval', this.interval);
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
        console.info('Update already');
        this.update();
      } else {
        this.doc.on('load', () => {
          console.info('Load');
          this.update();
        });
      }
      this.doc.on('op', () => {
        console.info('Op');
        this.update();
      });
    };

    update = () => {
      if (!this.unmounted) {
        if (!this.state.dataFn) {
          console.info('dataFn');
          this.setState({
            dataFn: generateReactiveFn(this.doc, readOnly, this.update)
          });
        }
        if (this.doc.data !== undefined) {
          this.setState({ data: cloneDeep(this.doc.data) });
          if (this.interval) {
            console.info('Clearing interval');
            window.clearInterval(this.interval);
            this.interval = undefined;
          }
        } else {
          console.info('Update, not this.doc.data');
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
        console.info('Clearing interval, unmount');
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
