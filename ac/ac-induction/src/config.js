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
      title: 'Definition(s) always true :',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    falseDef: {
      title: 'Definition(s) not always true :',
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
          isIncorrect: {
            title: 'Is the example true',
            type: 'boolean'
          },
          whyIncorrect: {
            title: "Why isn't it correct",
            type: 'string'
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
