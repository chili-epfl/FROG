// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import type { ActivityRunnerT } from 'frog-utils';

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const schema = {
    title: activityData.config.name,
    type: 'object',
    properties: {}
  };

  const uiSchema = {
    MCQ: { 'ui:options': { backgroundColor: 'pink' } }
  };

  activityData.config.MCQ.forEach((q, i) => {
    const radio = {
      type: 'string',
      title: q.question,
      enum: q.answers.map(answer => answer.answer)
    };
    const justification = {
      type: 'string',
      title: 'Explain your answer'
    };
    schema.properties['' + i] = {
      type: 'object',
      title: 'Question ' + (1 + i),
      properties: activityData.config.justify
        ? { radio, justification }
        : { radio }
    };
    uiSchema['' + i] = {
      radio: { 'ui:widget': 'radio' }
    };
  });

  const formData = data.form;

  const onSubmit = () => {
    dataFn.objInsert(true, 'completed');
  };

  const onChange = e => {
    dataFn.objInsert(e.formData, 'form');
  };

  return (
    <div>
      {data.completed ? (
        <h1>Form completed!</h1>
      ) : (
        <Form {...{ schema, uiSchema, formData, onSubmit, onChange }} />
      )}
    </div>
  );
};
