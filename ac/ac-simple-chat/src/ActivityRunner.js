// @flow

import * as React from 'react';
import {
  type ActivityRunnerT,
  TextInput,
  uuid,
  ReactiveText
} from 'frog-utils';

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => (
  <>
    <h1>{activityData.config.title}</h1>
    {config.showMood && (
      <>
        Our mood today:{' '}
        <ReactiveText path="mood" dataFn={dataFn} type="textinput" />
      </>
    )}
    {data.chats.map((chatMsg, i) => (
      <li key={chatMsg.id}>
        <i>{chatMsg.from}</i>:{' '}
        {chatMsg.li ? <dataFn.LearningItem li={chatMsg.li} /> : chatMsg.msg}
      </li>
    ))}
    <TextInput
      clearOnEnter
      onSubmit={msg => {
        if (msg.trim() !== '') {
          dataFn.listAppend({ from: userInfo.name, msg, id: uuid() }, 'chats');
          logger({ type: 'said', value: msg });
        }
      }}
    />
    {activityData.config.allowLearningItem && (
      <dataFn.LearningItem
        type="create"
        onCreate={li => {
          dataFn.listAppend({ from: userInfo.name, li, id: uuid() }, 'chats');
          logger({ type: 'added.learning.item', itemId: li });
        }}
      />
    )}
  </>
);

export default (ActivityRunner: ActivityRunnerT);
