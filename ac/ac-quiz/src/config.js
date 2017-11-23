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
      type: 'string',
      title: 'Guidelines'
    },
    justify: {
      type: 'boolean',
      title: 'Students must justify their responses'
    },
    hasAnswers: { type: 'boolean', title: 'Provide correct answers' },
    questions: {
      type: 'array',
      title: 'Questions',
      items: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
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

export const configUI = {
  'questions.answers.correct': { conditional: 'hasAnswers' }
};
