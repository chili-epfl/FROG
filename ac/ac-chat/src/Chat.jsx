// @flow

import React from 'react';

import type { ActivityRunnerT } from 'frog-utils';

import TextInput from './TextInput';

const Chatmsg = ({ msg }) => <li>{msg.user}: {msg.msg}</li>;

export default (
  {
    configData,
    logger,
    reactiveData,
    reactiveFn,
    userInfo,
    object
  }: ActivityRunnerT
) => {
  const socialStructure = object.socialStructures.find(x => x[userInfo.id]);
  const attributes = (socialStructure && socialStructure[userInfo.id]) || {
    group: 'EVERYONE',
    role: 'DEFAULT'
  };

  const group = attributes[configData.groupBy || 'group'];
  const messages = reactiveData.list.filter(x => x.groupId === group);
  const addMessage = reactiveFn(group).listAdd;

  // { messages, userInfo, addMessage, logger }: ChatT) => (

  return (
    <div>
      <h4>{configData.title}</h4>
      <ul>
        {messages.map(chatmsg => (
          <Chatmsg msg={chatmsg.value} key={chatmsg._id} />
        ))}
      </ul>
      <TextInput
        callbackFn={e => {
          addMessage({ msg: e, user: userInfo.name });
          logger({ chat: e });
        }}
      />
    </div>
  );
};
