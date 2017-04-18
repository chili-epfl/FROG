// @flow

import React from 'react';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';
import { Button } from 'react-bootstrap';

import { Chat, type ActivityRunnerT } from 'frog-utils';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const ListContainer = styled.div`
  padding: 2%;
  width: 70%;
`;

const ChatContainer = styled.div`
  padding: 2%;
  width: 30%;
`;

const IdeaContainer = styled.div`
  margin: 2px;
  width: 100%;
  background: #fff;
  border-style: solid;
  border-width: 5px;
`;

const Idea = ({ idea, fun }) => (
  <IdeaContainer>
    <b>{idea.value.title}</b>
    <p>{idea.value.text}</p>
    <p>SCORE: {idea.value.score}</p>
    <Button
      bsStyle="success"
      onClick={() =>
        fun.vote(idea._id, { ...idea.value, score: idea.value.score + 1 })}
    >
      +1
    </Button>
    <Button
      bsStyle="danger"
      onClick={() =>
        fun.vote(idea._id, { ...idea.value, score: idea.value.score - 1 })}
    >
      -1
    </Button>
    <Button
      bsStyle="danger"
      style={{ float: 'right' }}
      onClick={() => fun.delete(idea._id)}
    >
      Remove
    </Button>
  </IdeaContainer>
);

const IdeaList = ({ ideas, fun }) =>
  ideas.length
    ? <div>
        {ideas
          .sort((a, b) => b.value.score - a.value.score)
          .map(idea => <Idea idea={idea} fun={fun} key={idea._id} />)}&nbsp;
      </div>
    : <p>Please submit an idea</p>;

export default (
  {
    configData,
    object,
    userInfo,
    logger,
    reactiveFn,
    reactiveData
  }: ActivityRunnerT
) => {
  const socialStructure = object.socialStructures.find(x => x[userInfo.id]);
  const group = (socialStructure &&
    socialStructure[userInfo.id][configData.groupBy]) ||
    'default';

  const chatGroup = 'CHAT_' + group;

  const schema = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        title: 'Idea'
      },
      text: {
        type: 'string',
        title: 'Text'
      }
    }
  };

  const onSubmit = e => {
    if (e.formData && e.formData.title && e.formData.text) {
      reactiveFn(group).listAdd({ score: 0, ...e.formData });
      reactiveFn(group).keySet('DATA', {});
    }
  };

  const onChange = e => {
    reactiveFn(group).keySet('DATA', e.formData);
  };

  const reactiveKey = reactiveData.keys.find(x => x.groupId === group);
  const formData = reactiveKey ? reactiveKey.DATA : null;

  return (
    <Container>
      <ChatContainer>
        <Chat
          messages={reactiveData.list.filter(x => x.groupId === chatGroup)}
          userInfo={userInfo}
          addMessage={reactiveFn(chatGroup).listAdd}
          logger={logger}
        />
      </ChatContainer>
      <ListContainer>
        <p>{configData.text}</p>
        <IdeaList
          ideas={reactiveData.list.filter(x => x.groupId === group)}
          fun={{
            vote: reactiveFn(group).listSet,
            delete: reactiveFn(group).listDel
          }}
        />
        <Form {...{ schema, onChange, formData, onSubmit }} />
      </ListContainer>
    </Container>
  );
};
