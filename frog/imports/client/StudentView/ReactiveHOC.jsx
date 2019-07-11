// @flow
import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { cloneDeep } from 'lodash';
import { getDisplayName } from '/imports/frog-utils';

import LearningItem from '/imports/client/LearningItem';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import { ErrorBoundary } from '../App/ErrorBoundary';
import { connection } from '../App/connection';

const SubscriptionCache = {};

const docSubscribe = async (conn, coll, id) =>
  new Promise(async resolve => {
    const key = `${coll}#${id}`;
    if (SubscriptionCache[key]) {
      SubscriptionCache[key].listeners += 1;
      resolve(SubscriptionCache[key].doc);
    }

    const doc = await new Promise(resolv2 => {
      const localDoc = conn.get(coll, id);
      localDoc.setMaxListeners(3000);
      if (localDoc.type) {
        resolv2(localDoc);
      }
      localDoc.subscribe(() => resolv2(localDoc));
    });

    SubscriptionCache[key] = { listeners: 1, doc };
    resolve(doc);
  });

type ReactiveCompPropsT = Object;

type ReactiveCompsStateT = {
  data: any,
  dataFn: ?Object,
  timeout: boolean
};

const ReactiveHOC = (
  docId: string,
  conn?: any,
  readOnly: boolean = false,
  collection?: string,
  meta?: Object,
  backend: any,
  stream?: Function,
  sessionId?: string,
  transform?: Function,
  rawData?: any
) => (WrappedComponent: React.ComponentType<*>) => {
  class ReactiveComp extends React.Component<
    ReactiveCompPropsT,
    ReactiveCompsStateT
  > {
    doc: any;

    unmounted: boolean;

    interval: any;

    intervalCount: number = 0;

    times: 0;

    constructor(props: Object) {
      super(props);
      this.state = {
        data: null,
        dataFn: null,
        timeout: false
      };
    }

    componentDidMount = () => {
      this.unmounted = false;
      if (readOnly && rawData !== undefined) {
        this.setState({
          dataFn: generateReactiveFn(
            {},
            LearningItem,
            meta,
            readOnly,
            undefined,
            backend,
            stream
          ),
          data: rawData
        });
      } else {
        docSubscribe(conn || connection, collection || 'rz', docId).then(e => {
          this.doc = e;

          this.interval = window.setInterval(() => {
            this.intervalCount += 1;
            if (this.intervalCount > 10) {
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
            this.doc.once('load', () => {
              this.update();
            });
          }
          this.doc.on('op', () => {
            this.update();
          });
        });
      }
    };

    update = () => {
      if (!this.unmounted) {
        if (!this.state.dataFn) {
          this.setState({
            dataFn: generateReactiveFn(
              this.doc,
              LearningItem,
              meta,
              readOnly,
              this.update,
              backend,
              stream,
              sessionId
            )
          });
        }
        if (this.doc.data !== undefined) {
          this.setState({ data: cloneDeep(this.doc.data) });
          // for embedded activities
          window.parent.postMessage(
            {
              type: 'frog-data',
              msg: this.doc.data
            },
            '*'
          );

          if (transform) {
            window.parent.postMessage(
              {
                type: 'frog-data-transformed',
                msg: transform(this.doc.data)
              },
              '*'
            );
          }

          if (this.interval) {
            window.clearInterval(this.interval);
            this.interval = undefined;
          }
        }
      }
    };

    componentWillUnmount = () => {
      this.doc.removeListener('op', this.update);
      this.doc.removeListener('load', this.update);
      this.unmounted = true;
      if (this.interval) {
        window.clearInterval(this.interval);
        this.interval = undefined;
      }
    };

    render = () =>
      this.state.timeout ? (
        <h1>Sorry, reactive data timed out. Try reloading the page</h1>
      ) : this.state.data ? (
        <ErrorBoundary msg="Activity crashed, try reloading">
          <WrappedComponent
            dataFn={this.state.dataFn}
            data={this.state.data}
            {...this.props}
          />
        </ErrorBoundary>
      ) : (
        <CircularProgress />
      );
  }

  ReactiveComp.displayName = `ReactiveHOC(${getDisplayName(WrappedComponent)})`;
  return ReactiveComp;
};

export default ReactiveHOC;
