// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';
import dashboard from './Dashboard';

const meta = {
  name: 'Timed Quiz',
  shortDesc: 'Provide limited time to answer each question.',
  description: 'Provide limited time to answer each question.',
  exampleData: [
    { title: 'Case with no data', config: { title: 'No data' }, data: {} }
  ]
};

const config = {
  type: 'object',
  required: ['fr', 'en'],
  properties: {
    delay: {
      title: 'Delay between questions (ms)',
      type: 'number',
      default: 2000
    },
    maxTime: {
      title: 'Maximum time to answer question (ms)',
      type: 'number',
      default: 5000
    },
    shuffle: {
      type: 'string',
      title: 'Shuffle questions, answers or both for each student?',
      enum: ['none', 'answers', 'questions', 'both'],
      default: 'none'
    },
    fr: {
      required: ['objects', 'colors'],
      type: 'object',
      title: 'French',
      properties: {
        questionsFR: {
          type: 'array',
          title: 'Questions',
          items: {
            type: 'object',
            properties: {
              question: {
                type: 'rte',
                title: 'Question'
              },
              answers: {
                type: 'array',
                title: 'Choices',
                items: {
                  type: 'object',
                  properties: {
                    choice: {
                      type: 'string',
                      title: 'choice'
                    },
                    isCorrect: { type: 'boolean', title: 'Correct answer' }
                  }
                }
              }
            }
          }
        }

      }
    },
    en: {
      type: 'object',
      required: ['objects', 'colors'],
      title: 'English',
      properties: {
        questionsEN: {
          type: 'array',
          title: 'Questions',
          items: {
            type: 'object',
            properties: {
              question: {
                type: 'rte',
                title: 'Question'
              },
              answers: {
                type: 'array',
                title: 'Choices',
                items: {
                  type: 'object',
                  properties: {
                    choice: {
                      type: 'string',
                      title: 'choice'
                    },
                    isCorrect: { type: 'boolean', title: 'Correct answer' }
                  }
                }
              }
            }
          }
        }

      }
    },
  }
};

export const validateConfig = [
  (formData: Object) =>
    !formData.questionsEN || formData.questionsEN.length === 0
    || !formData.questionsFR || formData.questionsFR.length === 0
      ? { err: 'You must have at least one question' }
      : null
];

// default empty reactive datastructure, typically either an empty object or array
// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
  progress: 0,
  score: 0,
  time: 0
};


export default ({
  id: 'ac-timedQuiz',
  type: 'react-component',
  meta,
  config,
  validateConfig,
  ActivityRunner,
  dashboard,
  dataStructure
}: ActivityPackageT);
