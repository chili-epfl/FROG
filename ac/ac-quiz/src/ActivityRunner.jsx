// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components'
import type { ActivityRunnerT } from 'frog-utils';

const Main = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #FDFDFD;
`

const Container = styled.div`
  max-width: 500px;
  max-height: 100%;
  margin: 10px;
  flex: 0 1 auto;
`

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {

  console.log(activityData.config)

  const schema = {
    title: activityData.config.name,
    type: 'object',
    properties: {}
  };

  const uiSchema = {};

  activityData.config.questions.filter(q => q.question && q.answers).forEach((q, i) => {
    const radio = {
      type: 'string',
      title: q.question,
      enum: q.answers
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
    <Main>
      <h1>{activityData.config.title || 'Quiz'}</h1>
      <Container>
        {activityData.config.guidelines || 'Answer the following questions'}
      </Container>
      <Container>
        {data.completed
          ? <h1>Form completed!</h1>
          : <Form {...{ schema, uiSchema, formData, onSubmit, onChange }} />}
      </Container>
    </Main>
  );
};
