// @flow

const listItems = [
  { id: '1', score: 0, title: 'AirBnB', content: 'Uber for hotels' },
  { id: '2', score: 1, title: 'Uber', content: 'AirBnB for taxis' },
  { id: '3', score: 4, title: 'Amazon Alexa', content: 'AskJeeves for speech' }
];

export default {
  name: 'Brainstorm',
  type: 'react-component',
  shortDesc:
    'Display text items, and vote up/down. Optionally students can add new items',
  description:
    'This activity features a list of items with title and content. Items have a score attached, and are ordered by score. Students can vote up or down, and optionally add new items.',

  dataTypes: {
    incoming: [{ _score: 'number', title: 'string', content: 'string' }],
    outgoing: {
      Id: { id: 'Id', score: 'number', title: 'string', content: 'string' }
    }
  },

  exampleData: [
    {
      title: 'Empty list',
      config: {
        text: 'This is an empty list, please fill it up',
        formBoolean: true
      },
      data: {}
    },
    {
      title: 'List with some items, students not able to add',
      config: {
        text: 'This list has some items, vote them up or down',
        formBoolean: false
      },
      data: listItems
    },
    {
      title: 'List with some items, students able to add',
      config: {
        text:
          'This list has some items, vote them up or down, and add new ones',
        formBoolean: true
      },
      data: listItems
    }
  ]
};
