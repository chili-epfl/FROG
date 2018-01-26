// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import styled from 'styled-components';
import { HTML } from 'frog-utils';

import Widget from './Widget';
import { condShuffle } from './Quiz';

const QuestionTitle = styled.div`
  border-top: solid;
  padding-top: 10px;
`;

const DescriptionField = props => (
  <QuestionTitle>
    <HTML html={props.description} />
  </QuestionTitle>
);

export default ({
  question,
  questionIndex,
  index,
  data,
  dataFn,
  logger,
  groupingValue,
  activityData
}: Object) => {
  const answersWithIndex = question.answers.map((x, y) => [x, y]);
  const answers = ['answers', 'both'].includes(activityData.config.shuffle)
    ? condShuffle(answersWithIndex, 'answers', index, groupingValue)
    : answersWithIndex;

  const uiSchema = {
    'ui:widget': 'Widget',
    'ui:description': question.question
  };

  const schema = {
    type: 'number',
    title: 'Question ' + (index + 1),
    enum: answers.map(([_, answerIndex]) => answerIndex + 1),
    enumNames: answers.map(([answer, _]) => answer.choice)
  };

  const widgets = { Widget };
  const fields = { DescriptionField };
  const formData = data[questionIndex] + 1;
  const onChange = e => {
    dataFn.objInsert(e.formData - 1, [questionIndex]);
    logger({ type: 'choice', itemId: questionIndex, value: e.formData - 1 });
  };

  return (
    <Form {...{ schema, uiSchema, formData, onChange, widgets, fields }}>
      <div />
    </Form>
  );
};
