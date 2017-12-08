// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';
import seededShuffle from 'seededshuffle';
import { type ActivityRunnerT, HTML } from 'frog-utils';

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

const condShuffle = (list, type, salt, seed) =>
  seededShuffle.shuffle(list, seed + salt, true);

const DescriptionField = props => (
  <QuestionTitle>
    <HTML html={props.description} />
  </QuestionTitle>
);

const Question = ({
  question,
  index,
  data,
  dataFn,
  logger,
  groupingValue,
  activityData
}) => {
  const itemId = 'q' + (index + 1);
  const answers = ['answers', 'both'].includes(activityData.config.shuffle)
    ? condShuffle(
        question.answers.map((x, y) => [x, y]),
        'answers',
        index,
        groupingValue
      )
    : question.answers.map((x, y) => [x, y]);

  const uiSchema = {
    'ui:widget': 'latexWidget',
    'ui:description': question.question
  };

  const schema = {
    type: 'number',
    title: 'Question ' + (index + 1),
    enum: answers.map(([_, k]) => k + 1),
    enumNames: answers.map(([k]) => k.choice)
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

const Quiz = (props: ActivityRunnerT) => {
  const { activityData, groupingValue } = props;

  const questions = ['questions', 'both'].includes(activityData.config.shuffle)
    ? condShuffle(
        activityData.config.questions
          .filter(q => q.question && q.answers)
          .map((x, i) => [x, i]),
        'questions',
        '',
        groupingValue
      )
    : activityData.config.questions
        .filter(q => q.question && q.answers)
        .map((x, i) => [x, i]);

  return questions
    .filter(q => q.question && q.answers)
    .map((question, index) => (
      <Question
        {...{ ...props, question, index, key: question.question + index }}
      />
    ));
};

export default (props: ActivityRunnerT) => {
  const { activityData, data } = props;
  return (
    <Main>
      <h1>{activityData.config.title || 'Quiz'}</h1>
      <Container>
        <HTML
          html={
            activityData.config.guidelines || 'Answer the following questions'
          }
        />
      </Container>
      <Container>
        {data.completed ? <h1>Form completed!</h1> : <Quiz {...props} />}
      </Container>
    </Main>
  );
};
