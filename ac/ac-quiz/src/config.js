// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    guidelines: {
      type: 'rte',
      title: 'Guidelines'
    },
    shuffle: {
      type: 'string',
      title: 'Shuffle questions, answers or both for each student?',
      enum: ['none', 'answers', 'questions', 'both'],
      default: 'none'
    },
    showOne: {
      type: 'boolean',
      title: 'Show questions only one at a time'
    },
    allowSkip: {
      type: 'boolean',
      title: 'Allow skipping questions?'
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
          multiple: {
            type: 'boolean',
            title: 'Allow selecting multiple answers',
            default: false
          },
          text: {
            type: 'boolean',
            title: 'Ask for a text answer',
            default: false
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
    },
    advancedConfig: {
      type: 'boolean',
      title: 'Use advanced configuration'
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
  shuffle: { conditional: 'advancedConfig' },
  showOne: { conditional: 'advancedConfig' },
  allowSkip: { conditional: 'advancedConfig' },
  argueWeighting: { conditional: 'advancedConfig' },
  hasAnswers: { conditional: 'advancedConfig' },
  'questions.multiple': { conditional: 'advancedConfig' },
  'questions.text': { conditional: 'advancedConfig' },
  'questions.answers.x': { conditional: 'argueWeighting' },
  'questions.answers.y': { conditional: 'argueWeighting' },
  'questions.answers.isCorrect': { conditional: 'hasAnswers' }
};
