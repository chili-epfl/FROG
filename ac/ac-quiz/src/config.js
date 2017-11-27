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
            title: 'Answers',
            items: {
              type: 'string',
              title: 'answer'
            }
          }
        }
      }
    },
    justify: {
      type: 'boolean',
      title: 'Students must justify their answers'
    }
  }
};
