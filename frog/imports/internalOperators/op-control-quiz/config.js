export const config = {
  type: 'object',
  properties: {
    mode: {
      type: 'string',
      title: 'Include or exclude students',
      enum: ['include', 'exclude'],
      default: 'include'
    },
    questionIndex: {
      type: 'number',
      title: 'What is the question index of the quiz?'
    },
    answer: {
      type: 'string',
      title: 'What answer should be matched'
    }
  }
};

export const configUI = {};

export const validateConfig = [
  ({ questionIndex }) =>
    questionIndex === undefined || questionIndex < 0
      ? {
          field: 'Question Index',
          err: 'The question index is wrong'
        }
      : null,
  ({ answer }) =>
    !answer
      ? {
          field: 'Answer',
          err: 'You must specify an answer'
        }
      : null
];
