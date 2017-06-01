// @flow

import React from 'react';

import type { ActivityRunnerT } from 'frog-utils';

import TextInput from './TextInput';

const Chatmsg = ({ msg }) => <li>{msg.user}: {msg.msg}</li>;

export default ({
  configData,
  logger,
  data,
  dataFn,
  userInfo,
  object
}: ActivityRunnerT) => {
  return (
    <div>
      <h4>{configData.title}</h4>
      <ul>
        {data.map((chatmsg, i) => <Chatmsg msg={chatmsg} key={i} />)}
      </ul>
      <TextInput
        callbackFn={e => {
          dataFn.listAppend({ msg: e, user: userInfo.name });
          logger({ chat: e });
        }}
      />
    </div>
  );
};
