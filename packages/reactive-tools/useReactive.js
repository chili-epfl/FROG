import * as React from 'react';
import cloneDeep from 'lodash/cloneDeep';

import { generateReactiveFn } from './generateReactiveFn';

export const useReactive = (connection, collection, docId, userid) => {
  const [data, setData] = React.useState(null);
  const [dataFn, setDataFn] = React.useState(null);
  const [timeout, setTimeout] = React.useState(false);
  const doc = React.useRef();
  const presenceSent = React.useRef(false);
  const interval = React.useRef();
  const intervalCount = React.useRef();
  let unmounted = false;

  const update = () => {
    if (!unmounted) {
      if (!dataFn) {
        setDataFn(generateReactiveFn(doc.current));
      }
      if (doc.current.data !== null) {
        if (presenceSent.current === null && userid) {
          // set presence when data has been loaded
          doc.current.submitPresence({
            u: userid
          });
          presenceSent.current = true;
        }
        doc.requestReplyPresence = false;

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

    doc.requestReplyPresence = true;
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
