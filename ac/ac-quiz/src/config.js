// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    guidelines: {
      type: 'string',
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
            title: 'Answers',
            items: {
              type: 'object',
              properties: {
                answer: {
                  type: 'string',
                  title: 'answer'
                },
                x: {
                  type: 'integer'
                },
                y: {
                  type: 'integer'
                }
              }
            }
          }
        }
      }
    }
  }
};

export const configUI = {
  'questions.answers.x': { conditional: 'argueWeighting' },
  'questions.answers.y': { conditional: 'argueWeighting' }
};
