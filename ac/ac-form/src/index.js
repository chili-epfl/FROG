// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import config from './config';
import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';

export const meta = {
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
    userInfo,
    reactiveData,
    reactiveFn,
    saveProduct
  } = art;

  const reactiveKey = reactiveData.keys.find(x => x.groupId === userInfo.id);
  const completed = reactiveKey ? reactiveKey.COMPLETED : false;

  const schema = modifyForm(configData.questions, configData.title);

  const onSubmit = e => {
    saveProduct(userInfo.id, e.formData);
    if (!configData.multiple) {
      complete();
    }
  };

  const complete = () => {
    reactiveFn(userInfo.id).keySet('COMPLETED', true);
  };

  return (
    <div>
      {completed
        ? <h1>Form(s) submitted</h1>
        : <div>
            <Form {...{ schema, onSubmit }} />
            {!!configData.multiple &&
              <button onClick={complete} className="btn btn-primary btn-sm">
                Complete
              </button>}
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
