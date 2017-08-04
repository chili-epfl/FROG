// @flow

export const config = {
  type: 'object',
  required: ['title', 'questions'],
  properties: {
    title: {
      type: 'string',
      title: 'Form title'
    },
    questions: {
      type: 'string',
      title: 'Type in questions, separated by comma'
    },
    multiple: {
      type: 'boolean',
      title: 'Allow multiple submissions?'
    }
  }
};

export const validateConfig = [
  (data: Object): null | { field: string, err: string } =>
    data.questions.split(',').length > 5
      ? { field: 'questions', err: 'You cannot have more than 5 questions' }
      : null
];
