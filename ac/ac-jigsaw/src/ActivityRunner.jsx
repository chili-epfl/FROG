// @flow

import React from 'react';
import Form from 'react-jsonschema-form';

import { Chat, type ActivityRunnerT } from 'frog-utils';

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
    title: 'Questions',
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
    <div>
      <h1>{configData.title}</h1>
      <p>{configData.content}</p>
      <p>Your group: {attributes.group}, Your role: {attributes.role}</p>
      <p>{contentPerRole[attributes.role]}</p>
      {completed && <h1>From Submitted</h1>}
      {configData.questions.length > 0 &&
        <Form {...{ schema, formData, onChange, onSubmit }} />}
      <Chat
        messages={reactiveData.list.filter(x => x.groupId === group)}
        userInfo={userInfo}
        addMessage={reactiveFn(group).listAdd}
        logger={logger}
      />
    </div>
  );
};
