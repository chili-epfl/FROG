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
  padding-top: 15px;
  font-size: large;
`;

const TitleField = props =>
  <QuestionTitle>
    <Latex>
      {props.title}
    </Latex>
  </QuestionTitle>;

const Quiz = ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const schema = {
    title: activityData.config.name,
    type: 'object',
    properties: {}
  };

  const uiSchema = {};

  activityData.config.questions
    .filter(q => q.question && q.answers)
    .forEach((q, i) => {
      const radio = {
        type: 'string',
        enum: q.answers,
        title: ' '
      };
      const justification = {
        type: 'string',
        title: 'Explain your answer'
      };
      schema.properties['' + i] = {
        type: 'object',
        title: q.question,
        properties: activityData.config.justify
          ? { radio, justification }
          : { radio }
      };
      uiSchema['' + i] = {
        radio: { 'ui:widget': 'latexWidget' }
      };
    });

  const widgets = { latexWidget: LatexWidget };
  const fields = { TitleField };
  const formData = data.form;
  const onSubmit = () => {
    dataFn.objInsert(true, 'completed');
  };
  const onChange = e => {
    dataFn.objInsert(e.formData, 'form');
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
      <h1>
        {activityData.config.title || 'Quiz'}
      </h1>
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
