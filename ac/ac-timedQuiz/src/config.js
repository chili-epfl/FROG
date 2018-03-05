// @flow

export const config = {
  type: 'object',
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
    guidelines: {
      type: 'rte',
      title: 'Guidelines'
    },
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
    !formData.questionsEN ||
    formData.questionsEN.length === 0 ||
    !formData.questionsFR ||
    formData.questionsFR.length === 0
      ? { err: 'You must have at least one question' }
      : null
];
