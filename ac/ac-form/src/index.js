// @flow

import React from 'react';
import Form from 'react-jsonschema-form';

import type { ActivityRunnerT, ActivityPackageT } from 'frog-utils';

import config from './config';

const meta = {
  name: 'Simple form',
  type: 'react-component',
  shortDesc: 'question-answer form',
  description: 'Creates a form with divers specified fields'
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

const ActivityRunner = ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const formData = data.form;

  const schema = modifyForm(
    activityData.config.questions,
    activityData.config.title
  );

  const onChange = e => {
    dataFn.objInsert(e.formData, 'form');
  };

  const onSubmit = () => {
    if (!activityData.config.multiple) {
      dataFn.objInsert(true, 'completed');
    }
  };

  const complete = () => {
    dataFn.objInsert(true, 'completed');
  };

  return (
    <div>
      {data.completed
        ? <h1>Form(s) submitted</h1>
        : <div>
            <Form {...{ schema, formData, onChange, onSubmit }} />
            {activityData.config.multiple &&
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
