// @flow

export default {
  type: 'object',
  properties: {
    justify: {
      type: 'boolean',
      title: 'Students must justify their answers'
    },
    MCQ: {
      title: 'MCQ',
      type: 'array',
      items: {
        type: 'object',
        title: 'New Question',
        properties: {
          question: {
            type: 'string',
            title: 'Question'
          },
          answers: {
            type: 'array',
            title: 'Possible answers',
            items: {
              type: 'object',
              properties: {
                answer: {
                  type: 'string',
                  title: 'Answer'
                }
              }
            }
          }
        }
      }
    }
  }
};
