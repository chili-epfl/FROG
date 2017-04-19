// @flow

import React from 'react';
import TextInput from './textInput';
import type { ChatT } from './types';

const Chatmsg = ({ msg }) => <li>{msg.user}: {msg.msg}</li>;

export default ({ messages, userInfo, addMessage, logger }: ChatT) => (
  <div>
    <h4>Chat</h4>
    <ul>
      {messages.map(chatmsg => (
        <Chatmsg msg={chatmsg.value} key={chatmsg._id} />
      ))}
    </ul>
    <div id="chatinput">
      <TextInput
        callbackFn={e => {
          addMessage({ msg: e, user: userInfo.name });
          logger({ key: userInfo.name, type: 'chat', msg: e});
        }}
        id="chatinput"
      />
    </div>
  </div>
);
