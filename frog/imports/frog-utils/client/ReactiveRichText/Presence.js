import * as React from 'react';
import { cloneDeep, isEmpty, uniqBy } from 'lodash';

import { pickColor } from './helpers';

export const Presence = ({ dataFn, id, userId }) => {
  const [presence, setPresence] = React.useState({});
  React.useEffect(() => {
    const update = () => setPresence(cloneDeep(dataFn.doc.presence));
    dataFn.doc.on('presence', update);

    return () => {
      dataFn.doc.removeListener('presence', update);
    };
  }, [id]);

  const userList = Object.values(presence)
    .filter(x => !isEmpty(x.u))
    .map(x => x.u.split('/'));
  const users = uniqBy(userList, x => x[0]).map((user, i) => [
    i > 0 && ', ',
    <span key={user[0]} style={{ color: pickColor(user[0]) }}>
      {user[0] === userId ? 'you' : user[1]}
    </span>
  ]);

  if (users.length === 0) {
    return null;
  }

  return <div>Currently editing: {users}</div>;
};
