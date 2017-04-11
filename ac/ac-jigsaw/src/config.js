// @flow

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    groupBy: {
      type: 'string',
      title: 'Grouping by',
      enum: ['role', 'group']
    },
    content: {
      type: 'string',
      title: 'Content to show to everyone'
    },
    contentPerRole: {
      type: 'array',
      title: 'Content to show to each role',
      items: {
        type: 'object',
        properties: {
          role: {
            type: 'string',
            title: 'Role'
          },
          content: {
            type: 'string',
            title: 'Content'
          }
        }
      }
    },
    questions: {
      title: 'Questions',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          question: {
            type: 'string',
            title: 'Question'
          }
        }
      }
    }
  }
};
