// @flow

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    hasExamples: {
      type: 'boolean',
      title: 'Give examples to the student ?'
    },
    nbExamples: {
      type: 'number',
      title: 'How many examples should be displayed ?'
    },
    hasTestWithFeedback: {
      type: 'boolean',
      title: 'Give test with feedback to the student ?'
    },
    nbTestFeedback: {
      type: 'number',
      title: 'How many test with feedback should be displayed ?'
    },
    hasDefinition: {
      type: 'boolean',
      title: 'Give a definition to the student ?'
    },
    hasTest: {
      type: 'boolean',
      title: 'Give test to the student ?'
    },
    nbTest: {
      type: 'number',
      title: 'How many test should be displayed ?'
    },
    examples: {
      title: 'New example',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
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
    }
  }
};
/*
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
*/
