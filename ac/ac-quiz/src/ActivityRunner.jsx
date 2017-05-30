// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import type { ActivityRunnerT, ProductT } from 'frog-utils';

export default (props: ActivityRunnerT) => {
  const {
    configData,
    saveProduct,
    object,
    userInfo,
    reactiveData,
    reactiveFn
  } = props;
  const { products, socialStructures } = object;

  const schema = {
    title: configData.name,
    type: 'object',
    properties: {}
  };

  const uiSchema = {
    MCQ: { 'ui:options': { backgroundColor: 'pink' } }
  };

  configData.MCQ.forEach((question, questionIndex) => {
    const radio = {
      type: 'string',
      title: question.question,
      enum: question.answers.map(answer => answer.answer)
    };
    const justification = {
      type: 'string',
      title: 'Explain your answer'
    };
    schema.properties['' + questionIndex] = {
      type: 'object',
      title: 'Question ' + (1 + questionIndex),
      properties: configData.justify ? { radio, justification } : { radio }
    };
    uiSchema['' + questionIndex] = {
      radio: { 'ui:widget': 'radio' }
    };
  });

  const socialStructure = socialStructures.find(x => x[userInfo.id]);
  const group = (socialStructure && socialStructure[userInfo.id].group) ||
    (configData.collab && 'EVERYONE') ||
    'ALONE' + userInfo.id;

  const reactiveKey = reactiveData.keys.find(x => x.groupId === group);
  const formData = reactiveKey ? reactiveKey.DATA : null;
  const completed = reactiveKey && reactiveKey['COMPLETED' + userInfo.id];

  if (!formData) {
    const findProducts = products.find(x => x.length > 0);
    const studentProduct = findProducts
      ? findProducts.find((p: ProductT) => p.userId === userInfo.id)
      : {};

    const product = studentProduct ? studentProduct.data : null;
    if (product) {
      reactiveFn(group).keySet('DATA', product);
    }
  }

  const onSubmit = e => {
    saveProduct(userInfo.id, e.formData);
    reactiveFn(group).keySet('COMPLETED' + userInfo.id, true);
  };

  const onChange = e => {
    reactiveFn(group).keySet('DATA', e.formData);
  };

  return (
    <div>
      {completed
        ? <h1>Form completed!</h1>
        : <Form {...{ schema, uiSchema, formData, onSubmit, onChange }} />}
    </div>
  );
};
