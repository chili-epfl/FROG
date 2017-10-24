// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';
import Latex from 'react-latex';
import type { ActivityRunnerT } from 'frog-utils';

import LatexWidget from './LatexWidget';

const Main = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fdfdfd;
`;

const Container = styled.div`
  max-width: 500px;
  max-height: 100%;
  margin: 10px;
  flex: 0 1 auto;
`;

const QuestionTitle = styled.div`
  border-top: solid;
  padding-top: 10px;
`;

const DescriptionField = props => (
  <QuestionTitle>
    <Latex>{props.description}</Latex>
  </QuestionTitle>
);

const Quiz = ({ activityData, data, dataFn, logger }: ActivityRunnerT) => {
  const schema = {
    title: activityData.config.name,
    type: 'object',
    properties: {}
  };

  const uiSchema = {};

  activityData.config.questions
    .filter(q => q.question && q.answers)
    .forEach((q, i) => {
      schema.properties['question ' + i] = {
        type: 'number',
        title: 'Question ' + (i + 1),
        enum: q.answers.map((_, k) => k),
        enumNames: q.answers
      };
      uiSchema['question ' + i] = {
        'ui:widget': 'latexWidget',
        'ui:description': q.question
      };
      if (activityData.config.justify) {
        schema.properties['question ' + i + ' justify'] = {
          type: 'string',
          title: ' ',
          description: 'Justify your answer'
        };
      }
    });

  const widgets = { latexWidget: LatexWidget };
  const fields = { DescriptionField };
  const formData = data.form;
  const onSubmit = e => {
    logger({ type: 'submit', payload: e.formData });
    dataFn.objInsert(true, 'completed');
  };
  const onChange = e => {
    dataFn.objInsert(e.formData, 'form');
    logger({ type: 'formData', payload: e.formData });
  };

  return (
    <Form
      {...{ schema, uiSchema, formData, onSubmit, onChange, widgets, fields }}
    />
  );
};

export default (props: ActivityRunnerT) => {
  const { activityData, data } = props;
  return (
    <Main>
      <h1>{activityData.config.title || 'Quiz'}</h1>
      <Container>
        <Latex>
          {activityData.config.guidelines || 'Answer the following questions'}
        </Latex>
      </Container>
      <Container>
        {data.completed ? <h1>Form completed!</h1> : <Quiz {...props} />}
      </Container>
    </Main>
  );
};
