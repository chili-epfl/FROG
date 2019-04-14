import * as React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import getDisplayName from './getDisplayName';
import { generateReactiveFn } from './generateReactiveFn';

export const useReactive = (connection, collection, docId) => {
  const [ready, setReady] = React.useState(false);
  const [data, setData] = React.useState(null);
  const [dataFn, setDataFn] = React.useState(null);
  const [timeout, setTimeout] = React.useState(false);
  const doc = React.useRef();
  const interval = React.useRef();
  const intervalCount = React.useRef();
  let unmounted = false;

  const update = () => {
    if (!unmounted) {
      if (!dataFn) {
        setDataFn(generateReactiveFn(doc.current));
      }
      if (doc.current.data !== null) {
        setData(cloneDeep(doc.current.data));

        if (interval.current) {
          window.clearInterval(interval.current);
          interval.current = undefined;
        }
      }
    }
  };
  React.useEffect(() => {
    doc.current = connection.get(collection, docId);
    doc.current.setMaxListeners(3000);
    doc.current.subscribe();

    interval.current = window.setInterval(() => {
      intervalCount.current += 1;
      if (intervalCount.current > 10) {
        setTimeout(true);
        window.clearInterval(interval.current);
        interval.current = null;
      } else {
        update();
      }
    }, 1000);

    if (doc.current.type) {
      update();
    } else {
      doc.current.once('load', () => {
        update();
      });
    }
    doc.current.on('op', () => {
      update();
    });
    return () => {
      doc.current.removeListener('op', update);
      doc.current.removeListener('load', update);
      unmounted = true;
      if (interval.current) {
        window.clearInterval(interval.current);
        interval.current = undefined;
      }
    };
  }, []);
  return [data, dataFn, timeout];
};
