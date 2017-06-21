// @flow

import React from 'react';

import { type ActivityRunnerT, uuid } from 'frog-utils';

import TextInput from './TextInput';

const Chatmsg = ({ msg }) => <li>{msg.user}: {msg.msg}</li>;

export default ({
  logger,
  activityData,
  data,
  dataFn,
  userInfo
}: ActivityRunnerT) =>
  <div>
    <h4>{activityData.config.title}</h4>
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
