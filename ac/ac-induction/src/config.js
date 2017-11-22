// @flow

export default {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    partStr: {
      type: 'string',
      title: 'List parts followed by nb (ex: \'f3,d,e4,t10,f5\')'
    },
    definition: {
      type: 'string',
      title: 'Final definition of the concept: '
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
