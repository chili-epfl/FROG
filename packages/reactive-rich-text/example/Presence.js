import * as React from 'react';
import Stringify from 'json-stable-stringify';
import { cloneDeep } from 'lodash';

export const Presence = ({ dataFn, id }) => {
  const [presence, setPresence] = React.useState({});
  React.useEffect(
    () => {
      const update = e => setPresence(cloneDeep(dataFn.doc.presence));
      dataFn.doc.on('presence', update);

      return () => dataFn.doc.removeListener('presence', update);
    },
    [id]
  );

  return (
    <div>
      {Object.values(presence).map(x => (
        <li key={x.u}>
          <b>{x.u}</b> - {Stringify(x)}
        </li>
      ))}
    </div>
  );
};
