import React from 'react';
import Form from "react-jsonschema-form";

export const meta = {
  name: 'Quiz with Multiple-Choice Questions',
  type: 'react-component'
}

export const config = {
  title: 'Configuration for MCQ',
  type: 'object',
  properties: {
    'name': {
      type: 'string',
      title: 'Activity name'
    },
    'MCQ': {
      title: "MCQ",
      type: "array",
      items: {
        type: "object",
        title: "New Question",
        required: [
          "title"
        ],
        properties: {
          title: {
            type: "string",
            title: "Question"
          },
          answers: {
            type: "array",
            title: "Possible answers",
            items: {
              type: "object",
              required: [
                "title"
              ],
              properties: {
                title: {
                  type: "string",
                  title: "Answer"
                },
                answer: {
                  type: "boolean",
                  title: "This is an answer",
                  default: false
                }
              }
            }
          },
          details: {
            type: "string",
            title: "Enter an explanation",
          }
        }
      }
    }
  }
}

// Obviously assumes even array
export const ActivityRunner = ({ config, logger, onCompletion }) => {
  const propdef = config.questions.split(',').reduce(
    (acc, x, i) => ({...acc, [i + '']: { type: 'string', title: x}}),
    {} )
  const formdef = { 
    title: config.title,
    type: 'object',
    properties: propdef
  } 
  return (
    <Form schema={formdef} onSubmit={(x) => onCompletion(x.formData)} onChange={(x) => logger({form: x.formData})} />
  )
}

export default { id: 'ac-quiz', meta: meta, config: config, ActivityRunner: ActivityRunner }
