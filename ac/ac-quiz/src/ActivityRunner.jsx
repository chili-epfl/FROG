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

const Question = ({ question, index, data, dataFn, logger }) => {
  const itemId = 'q' + (index + 1);

  const uiSchema = {
    'ui:widget': 'latexWidget',
    'ui:description': question.question
  };

  const schema = {
    type: 'number',
    title: 'Question ' + (index + 1),
    enum: question.answers.map((_, k) => k + 1),
    enumNames: question.answers.map(k => k.answer)
  };

  const widgets = { latexWidget: LatexWidget };
  const fields = { DescriptionField };
  const formData = data[itemId];

  const onChange = e => {
    dataFn.objInsert(e.formData, [itemId]);
    logger({ type: 'answer', itemId, payload: e.formData });
  };

  return (
    <Form {...{ schema, uiSchema, formData, onChange, widgets, fields }}>
      <div />
    </Form>
  );
};

const Quiz = (props: ActivityRunnerT) =>
  props.activityData.config.questions
    .filter(q => q.question && q.answers)
    .map((question, index) => (
      <Question
        {...{ question, index, ...props, key: question.question + index }}
      />
    ));

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
