// @flow

import React, { Component } from 'react';
import TextInput from './text_input';
import type { ActivityRunnerT, ChatT } from './types';

const Chatmsg = ({ msg }) => <li>{msg.user}: {msg.msg}</li>;

export default ({ messages, userInfo, addMessage, logger }: ChatT) => (
  <div>
    <h4>Chat</h4>
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
