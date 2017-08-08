// @flow

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    nMaxExamples: {
      type: 'number',
      title: 'Maximum number of examples shown to the student'
    },
    trueDef: {
      title: 'True definitions :',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    falseDef: {
      title: 'False definitions :',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    examples: {
      title: 'New example',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          image: {
            title: 'image URL',
            type: 'string'
          },
          isCorrect: {
            title: 'Is the example true',
            type: 'boolean'
          }
        }
      }
    },
    definition: {
      title: 'Real definition of the concept',
      type: 'string'
    }
  }
};
