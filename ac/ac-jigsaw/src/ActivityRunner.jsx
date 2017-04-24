// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';

import { Chat, type ActivityRunnerT } from 'frog-utils';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const TitleContainer = styled.div`
  padding: 2%;
  width: 100%;
`;

const FormContainer = styled.div`
  padding: 2%;
  width: 60%;
`;

const ChatContainer = styled.div`
  padding: 2%;
  width: 40%;
`;

export default (props: ActivityRunnerT) => {
  const {
    configData,
    logger,
    object,
    reactiveData,
    reactiveFn,
    saveProduct,
    userInfo
  } = props;

  const { socialStructures } = object;
  const contentPerRole = (configData.contentPerRole &&
    configData.contentPerRole.reduce(
      (acc, item) => ({ ...acc, [item.role]: item.content }),
      {}
    )) || {};

  const socialStructure = socialStructures.find(x => x[userInfo.id]);
  const attributes = (socialStructure && socialStructure[userInfo.id]) || {
    group: 'EVERYONE',
    role: 'DEFAULT'
  };

  // group is either the name of the group or of the role, depending on what has been configured
  const group = attributes[configData.groupBy || 'group'];

  const reactiveKey = reactiveData.keys.find(x => x.groupId === group);
  const completed = reactiveKey ? reactiveKey.COMPLETED : false;
  const formData = reactiveKey ? reactiveKey.DATA : null;

  const schema = {
    type: 'object',
    properties: configData.questions.reduce(
      (acc, x, i) => ({
        ...acc,
        [i + '']: { type: 'string', title: x.question }
      }),
      {}
    )
  };

  const onChange = e => {
    reactiveFn(group).keySet('DATA', e.formData);
  };

  const onSubmit = e => {
    saveProduct(group, e.formData);
    complete();
  };

  const complete = () => {
    reactiveFn(group).keySet('COMPLETED', true);
  };

  return (
    <Container>
      <TitleContainer>
        <h1>{configData.title}</h1>
        <p>{configData.content}</p>
      </TitleContainer>
      <FormContainer>
        <p>{contentPerRole[attributes.role]}</p>
        {completed && <h1>From Submitted</h1>}
        {configData.questions.length > 0 &&
          <Form {...{ schema, formData, onChange, onSubmit }} />}
      </FormContainer>
      <ChatContainer>
        <Chat
          messages={reactiveData.list.filter(x => x.groupId === group)}
          userInfo={userInfo}
          addMessage={reactiveFn(group).listAdd}
          logger={logger}
        />
      </ChatContainer>
    </Container>
  );
};
