import * as React from 'react';
import { uniq } from 'lodash';

// the actual component that the student sees
const ActivityRunner = props => {
  const {
    activityData,
    groupingValue,
    userInfo: { name },
    dataFn,
    data
  } = props;
  const configData = activityData.config;
  if (!data.includes(name)) {
    dataFn.listAppend(name);
  }

  const others = uniq(data).filter(x => x !== name);
  const hasOthers = others.length > 0;
  return (
    <div>
      {configData.title && <h1>{configData.title}</h1>}
      <h2>
        {configData.displayName && `Hi, ${name}. `} You are{' '}
        {!hasOthers && 'alone '}in group {groupingValue}.
      </h2>
      {configData.displayGroup &&
        hasOthers && (
          <h3>
            {'The other group members are: ' +
              uniq(data)
                .filter(x => x !== name)
                .sort()
                .join(', ')}
          </h3>
        )}
    </div>
  );
};

export default ActivityRunner;
