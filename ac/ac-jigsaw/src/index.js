// @flow

import React from 'react';

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';
import { Chat } from 'frog-utils';

export const meta = {
  name: 'Jigsaw activity',
  type: 'react-component'
};

export const config = {
  title: 'Configuration for the jigsaw activity',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Activity name'
    },
    duration: {
      type: 'number',
      title: 'Duration in seconds (0 for infinity)'
    },
    title: {
      type: 'string',
      title: 'Title'
    },
    roles: {
      type: 'string',
      title: 'Roles (separated by comma)'
    },
    text: {
      type: 'string',
      title: 'Text (separated by comma)'
    },
    grouBy: {
      type: 'string',
      title: "Grouping by 'role' or 'group'."
    }
  }
};

export const ActivityRunner = (art: ActivityRunnerT) => {
  const { config, object, userInfo, reactiveData, reactiveFn, logger } = art;

  const { products, socialStructures, globalStructure } = object;
  const roles = config.roles.split(',');
  const texts = config.text.split(',');
  const matching = {};
  roles.forEach((role, index) => matching[role] = texts[index]);

  const userRole = socialStructures[0][userInfo.id].role;
  const userGroup = socialStructures[0][userInfo.id].group;

  // collabGroup is either the name of the group or ofhte role, depending on what has been configured
  const collabGroup = socialStructures[0][userInfo.id][config.groupBy];

  const reactiveKey = reactiveData.keys.filter(x => x.groupId === collabGroup)[
    0
  ];

  return (
    <div>
      <h1>{config.title}</h1>
      <p>Your role is {userRole}</p>
      <p>Your group is {userGroup}</p>
      <p>Your filtered content is {matching[userRole]}</p>
      <div>
        <p>Collab field:</p>
        <input
          onChange={e =>
            reactiveFn(collabGroup).keySet('collabField', e.target.value)}
          value={reactiveKey ? reactiveKey.collabField : 'fill me'}
        />
      </div>
      <div className="col-md-4">
        <Chat
          messages={reactiveData.list.filter(x => x.groupId === collabGroup)}
          userInfo={userInfo}
          addMessage={reactiveFn(collabGroup).listAdd}
          logger={logger}
        />
      </div>
    </div>
  );
};

export default ({
  id: 'ac-jigsaw',
  ActivityRunner,
  config,
  meta
}: ActivityPackageT);
