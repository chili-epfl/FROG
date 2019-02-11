// @flow

import * as React from 'react';
import {
  type ActivityRunnerT,
  TextInput,
  uuid,
  ReactiveText
} from 'frog-utils';

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) => {
  const { config } = activityData;
  const { LearningItem } = dataFn;
  return (
    <>
      <h1>{config.title}</h1>
      {config.showMood && (
        <>
          <h2>Mood</h2>
          Our mood today:{' '}
          <ReactiveText path="mood" dataFn={dataFn} type="textinput" />
          <hr />
        </>
      )}
      <h2>Chats</h2>
      {data.chats.map((chatMsg, i) => (
        <li key={chatMsg.id}>
          <i>{chatMsg.from}</i>:{' '}
          {chatMsg.li ? (
            <LearningItem type="view" id={chatMsg.li} />
          ) : (
            chatMsg.msg
          )}
        </li>
      ))}
      <TextInput
        clearOnEnter
        onSubmit={msg => {
          if (msg.trim() !== '') {
            dataFn.listAppend(
              { from: userInfo.name, msg, id: uuid() },
              'chats'
            );
            logger({ type: 'said', value: msg });
          }
        }}
      />
      {config.allowLearningItem && (
        <LearningItem
          type="create"
          onCreate={li => {
            dataFn.listAppend({ from: userInfo.name, li, id: uuid() }, 'chats');
            logger({ type: 'added.learning.item', itemId: li });
          }}
        />
      )}
    </>
  );
};

export default (ActivityRunner: ActivityRunnerT);
