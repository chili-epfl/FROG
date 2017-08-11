// @flow

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    nExamples: {
      type: 'number',
      title: 'Number of examples shown to the student'
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
            title: "This example isn't correct",
            type: 'boolean'
          },
          whyIncorrect: {
            title: '(If incorrect) Why ?',
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
