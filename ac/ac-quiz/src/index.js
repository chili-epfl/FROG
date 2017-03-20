// @flow

import React from 'react';
import Form from 'react-jsonschema-form';
import type { ActivityRunnerT, ActivityPackageT, ProductT } from 'frog-utils';

export const meta = {
  name: 'Multiple-Choice Questions',
  type: 'react-component'
};
export const config = {
  title: 'Configuration for MCQ',
  type: 'object',
  properties: {
    collab: {
      type: 'boolean',
      title: 'Collaborative?'
    },
    justifications: {
      type: 'boolean',
      title: 'Do you want students to justify their answers?'
    },
    MCQ: {
      title: 'MCQ',
      type: 'array',
      items: {
        type: 'object',
        title: 'New Question',
        required: ['question'],
        properties: {
          question: {
            type: 'string',
            title: 'Question'
          },
          answers: {
            type: 'array',
            title: 'Possible answers',
            items: {
              type: 'object',
              required: ['answer'],
              properties: {
                answer: {
                  type: 'string',
                  title: 'Answer'
                }
              }
            }
          }
        }
      }
    }
  }
};

export const ActivityRunner = (props: ActivityRunnerT) => {
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
    schema.properties['' + questionIndex] = {
      type: 'object',
      title: 'Question ' + (1 + questionIndex),
      required: ['justification'],
      properties: {
        radio: {
          type: 'string',
          title: question.question,
          enum: question.answers.map(answer => answer.answer)
        },
        justification: {
          type: 'string',
          title: 'Explain your answer'
        }
      }
    };
    uiSchema['' + questionIndex] = {
      radio: { 'ui:widget': 'radio' }
    };
  });

  const socialStructure = socialStructures.find(x => x[userInfo.id]);

  const groupId = socialStructure
    ? socialStructure[userInfo.id].group
    : 'NO_GROUP';

  const reactiveKey = reactiveData.keys.find(x => x.groupId === groupId);
  const formData = reactiveKey ? reactiveKey['DATA' + userInfo.id] : null;

  const findPartner = socialStructure
    ? Object.keys(socialStructure).find(
        id => !(id === userInfo.id) && socialStructure[id].group === groupId
      )
    : null;

  const partnerId = findPartner || 'NO_ID';

  const partnerFormData = reactiveKey ? reactiveKey['DATA' + partnerId] : null;

  if (!formData) {
    const findProducts = products.find(x => x.length > 0);
    const studentProduct = findProducts
      ? findProducts.find((p: ProductT) => p.userId === userInfo.id)
      : {};

    const product = studentProduct ? studentProduct.data : null;

    reactiveFn(groupId).keySet('DATA' + userInfo.id, product);
  }

  const completed = reactiveKey
    ? reactiveKey['COMPLETED' + userInfo.id]
    : false;

  const onSubmit = e => {
    saveProduct(userInfo.id, e.formData);
    reactiveFn(groupId).keySet('COMPLETED' + userInfo.id, true);
  };

  const onChange = e => {
    reactiveFn(groupId).keySet('DATA' + userInfo.id, e.formData);
  };

  return (
    <div>
      <p>You are {userInfo.name}</p>
      {configData.collab
        ? <p>You are collaborating with the group {groupId}</p>
        : null}
      {completed
        ? <h1>Form completed!</h1>
        : <div>
            <div style={{ display: 'inline-block', width: '50%' }}>
              <Form {...{ schema, uiSchema, formData, onSubmit, onChange }} />
            </div>
            {configData.collab
              ? <div style={{ display: 'inline-block', width: '50%' }}>
                  <Form {...{ schema, uiSchema, formData: partnerFormData }} />
                </div>
              : null}
          </div>}
    </div>
  );
};

export default ({
  id: 'ac-quiz',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
