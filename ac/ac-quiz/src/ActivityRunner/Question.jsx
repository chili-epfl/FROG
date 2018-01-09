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
  index,
  data,
  dataFn,
  logger,
  groupingValue,
  activityData
}: Object) => {
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

  const widgets = { latexWidget: Widget };
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
