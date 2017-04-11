// @flow

import React from 'react';
import Form from 'react-jsonschema-form';

import { Chat, type ActivityRunnerT, type ActivityPackageT } from 'frog-utils';

import config from './config';

const meta = {
  name: 'Simple form',
  type: 'react-component'
};

const modifyForm = (questions, title) => {
  const propdef = questions
    .split(',')
    .reduce(
      (acc, x, i) => ({ ...acc, [i + '']: { type: 'string', title: x } }),
      {}
    );

  const formdef = {
    title,
    type: 'object',
    properties: propdef
  };

  return formdef;
};

const ActivityRunner = (art: ActivityRunnerT) => {
  const {
    configData,
    logger,
    object,
    reactiveData,
    reactiveFn,
    saveProduct,
    userInfo
  } = art;

  const { socialStructures } = object;
  const group = (socialStructures &&
    socialStructures[0] &&
    socialStructures[0][userInfo.id] &&
    socialStructures[0][userInfo.id].group) ||
    (configData.collab && 'EVERYONE') ||
    'ALONE' + userInfo.id;

  const reactiveKey = reactiveData.keys.find(x => x.groupId === group);
  const completed = reactiveKey ? reactiveKey.COMPLETED : false;
  const formData = reactiveKey ? reactiveKey.DATA : null;

  const schema = modifyForm(configData.questions, configData.title);

  const onChange = e => {
    reactiveFn(group).keySet('DATA', e.formData);
  };

  const onSubmit = e => {
    saveProduct(userInfo.id, e.formData);
    if (!configData.multiple) {
      complete();
    }
  };

  const complete = () => {
    reactiveFn(group).keySet('COMPLETED', true);
  };

  return (
    <div>
      {completed
        ? <h1>Form(s) submitted</h1>
        : <div>
            <Form {...{ schema, formData, onChange, onSubmit }} />
            {!!configData.multiple &&
              <button onClick={complete} className="btn btn-primary btn-sm">
                Complete
              </button>}
            {!!configData.collab &&
              <div>
                <p>Working with the group {group}</p>
                <Chat
                  messages={reactiveData.list.filter(x => x.groupId === group)}
                  userInfo={userInfo}
                  addMessage={reactiveFn(group).listAdd}
                  logger={logger}
                />
              </div>}
          </div>}

    </div>
  );
};

export default ({
  id: 'ac-form',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
