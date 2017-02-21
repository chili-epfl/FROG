// @flow

import React from 'react';
import Form from "react-jsonschema-form";
import type { ActivityRunnerT, ActivityPackageT, ProductT }  from 'frog-utils'

export const meta = {
  name: 'Multiple-Choice Questions',
  type: 'react-component'
}
export const config = {
  title: 'Configuration for MCQ',
  type: 'object',
  properties: {
    'collab': {
      type: 'boolean',
      title: 'Collaborative?'
    },
    'justifications': {
      type: 'boolean',
      title: 'Do you want students to justify their answers?'
    },
    'MCQ': {
      title: "MCQ",
      type: "array",
      items: {
        type: "object",
        title: "New Question",
        required: [
          "question"
        ],
        properties: {
          question: {
            type: "string",
            title: "Question"
          },
          answers: {
            type: "array",
            title: "Possible answers",
            items: {
              type: "object",
              required: [
                "answer"
              ],
              properties: {
                answer: {
                  type: "string",
                  title: "Answer"
                }
              }
            }
          }
        }
      }
    }
  }
}

export const ActivityRunner = (props: ActivityRunnerT) => {
  const { config, saveProduct, object, userInfo, reactiveData, reactiveFn } = props
  const { products, socialStructures } = object

  const schema = {
    title: config.name,
    type: 'object',
    properties: {}
  }
  
  const uiSchema = {
    'MCQ': { 'ui:options': { 'backgroundColor': 'pink' } }
  }
  
  config.MCQ.forEach(
    (question, questionIndex) => {
      schema.properties[''+questionIndex] = { 
        type: 'object',
        title: 'Question ' + (1 + questionIndex),
        required: [
          'justification'
        ],
        properties: {
          'radio': {
            type: 'string', 
            title: question.question,
            enum: question.answers.map((answer, answerIndex) => (answer.answer))
          },
          'justification': {
            type: 'string',
            title: 'Explain your answer'
          }
        }
      }
      uiSchema[''+questionIndex] = { 
        radio: { "ui:widget": "radio" } 
      }
    }
  )

  const socialStructure = socialStructures.find(x => x[userInfo.id]) 

  const groupId = socialStructure 
    ? socialStructure[userInfo.id].group
    : 'NO_GROUP'

  const reactiveKey = reactiveData.keys.find(x => x.groupId === groupId)
  const formData = reactiveKey
    ? reactiveKey['DATA' + userInfo.id]
    : null

  const partnerId =  socialStructure
    ? Object.keys(socialStructure).find(
      id => !(id === userInfo.id) && socialStructure[id].group === groupId
    )
    : userInfo.id

  const partnerFormData = reactiveKey
    ? reactiveKey['DATA' + partnerId]
    : null

  if(!formData){
    const studentProducts = products.filter(x => x.length > 0)[0] 
      ? products.filter(x => x.length > 0)[0].filter((p: ProductT) => p.userId === userInfo.id) 
      : []

    const product = studentProducts[0] 
      ? studentProducts[0].data 
      : null

    reactiveFn(groupId).keySet('DATA' + userInfo.id, product)
  }

  const onSubmit = (e) => {
    saveProduct(userInfo.id, e.formData)
  }

  const onChange = (e) => {
    reactiveFn(groupId).keySet('DATA' + userInfo.id, e.formData)
  }

  return (
    <div>
      <p>You are {userInfo.name}</p>
      {config.collab
        ? <p>You are collaborating with the group {groupId}</p>
        : null}
      <div style={{display: 'inline-block', width: '50%'} }>
        <Form {...{ schema, uiSchema, formData, onSubmit, onChange }} />
      </div>
      {config.collab
        ? <div style={{display: 'inline-block', width: '50%'}}>
            <Form {...{ schema, uiSchema, formData: partnerFormData }} />
        </div>
        : null}
    </div>
  )
}

export default ({ 
  id: 'ac-quiz',
  meta: meta,
  config: config,
  ActivityRunner: ActivityRunner
}: ActivityPackageT)
