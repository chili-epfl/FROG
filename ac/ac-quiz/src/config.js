// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    shuffle: {
      type: 'string',
      title: 'Shuffle questions, answers or both for each student?',
      enum: ['none', 'answers', 'questions', 'both'],
      default: 'none'
    },
    guidelines: {
      type: 'rte',
      title: 'Guidelines'
    },
    justify: {
      type: 'boolean',
      title: 'Students must justify their answers'
    },
    argueWeighting: {
      type: 'boolean',
      title: 'Use custom weighting?'
    },
    hasAnswers: { type: 'boolean', title: 'Provide correct answers' },
    questions: {
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
                x: {
                  type: 'integer'
                },
                y: {
                  type: 'integer'
                },
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
};

export const validateConfig = [
  (formData: Object) =>
    !formData.questions || formData.questions.length === 0
      ? { err: 'You must have at least one question' }
      : null
];

export const configUI = {
  'questions.answers.x': { conditional: 'argueWeighting' },
  'questions.answers.y': { conditional: 'argueWeighting' },
  'questions.answers.correct': { conditional: 'hasAnswers' }
};
