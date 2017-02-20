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
  const { config, saveProduct, object, userInfo } = props
  const { products } = object

  console.log('hello')
  console.log(object)

  const onSubmit = (e) => {
    saveProduct(userInfo.id, e.formData)
  }

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

  const studentProducts = products.filter(x => x.length > 0)[0] 
    ? products.filter(x => x.length > 0)[0].filter((p: ProductT) => p.userId === userInfo.id) 
    : []

  console.log(products.filter(x => x.length > 0))
  console.log(userInfo)
  console.log(studentProducts)

  const formData = studentProducts[0] 
    ? studentProducts[0].data 
    : null

  console.log(formData)

  return (
    <div>
      <p>You are {userInfo.name}</p>
      {config.collab
        ? <p>You are collaborating</p>
        : null}
      <Form 
        schema={schema}
        uiSchema={uiSchema}
        formData={formData}
        onSubmit={onSubmit}
      />
    </div>
  )
}

export default ({ 
  id: 'ac-quiz',
  meta: meta,
  config: config,
  ActivityRunner: ActivityRunner
}: ActivityPackageT)
