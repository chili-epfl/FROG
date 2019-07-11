import * as React from 'react';
import { cloneDeep, isEmpty } from 'lodash';

export const Presence = ({ dataFn, id, userId }) => {
  const [presence, setPresence] = React.useState({});
  React.useEffect(
    () => {
      const update = () => setPresence(cloneDeep(dataFn.doc.presence));
      dataFn.doc.on('presence', update);

      return () => dataFn.doc.removeListener('presence', update);
    },
    [id]
  );

  const users = Object.values(presence)
    .filter(x => !isEmpty(x.u))
    .map(x => x.u.split('/'))
    .map(x => (x[0] === userId ? 'you' : x[1]))
    .join(', ');

  if (users.length === 0) {
    return null;
  }

  return <div>Currently editing: {users}</div>;
};
