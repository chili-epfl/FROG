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
    definition: {
      type: 'string',
      title: 'Final definition of the concept: '
    },
    hasTest: {
      type: 'boolean',
      title: 'Give test to the student ?'
    },
    nbTest: {
      type: 'number',
      title: 'How many test should be displayed ?'
    },
    properties: {
      title:
        'Put all properties that you will need (watch for the index, start at 0)',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    suffisantSets: {
      title:
        "Put all minimum suffisant sets of properties as '{a,b},{a,c},…' (where a,b,c are the index of the above properties)",
      type: 'string'
    }, // minimum => a set should not contain another outline
    contradictoryProperties: {
      title: "Put all properties that contradict the concept as 'a,b,c'",
      type: 'string'
    },
    unnecessaryProperties: {
      title: "Put all properties that aren't related to the concept as 'a,b,c'",
      type: 'string'
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
          respectedProperties: {
            title:
              "Put all properties that are true for this example as 'a,b,c'",
            type: 'string'
          }
        }
      }
    }
  }
};
