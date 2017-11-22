// @flow

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    shuffle: {
      type: 'boolean',
      title: 'Shuffle questions and responses for each student?'
    },
    guidelines: {
      type: 'string',
      title: 'Guidelines'
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
