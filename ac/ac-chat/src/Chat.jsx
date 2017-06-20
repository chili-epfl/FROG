// @flow

import React from 'react';

import { type ActivityRunnerT, uuid } from 'frog-utils';

import TextInput from './TextInput';

const Chatmsg = ({ msg }) => <li>{msg.user}: {msg.msg}</li>;

export default ({
  configData,
  logger,
  data,
  dataFn,
  userInfo
}: ActivityRunnerT) =>
  <div>
    <h4>{configData.title}</h4>
    <ul>
      {data.map(chatmsg => <Chatmsg msg={chatmsg} key={chatmsg.id} />)}
    </ul>
    <TextInput
      callbackFn={e => {
        dataFn.listAppend({ msg: e, user: userInfo.name, id: uuid() });
        logger({ chat: e });
      }}
    />
  </div>;
