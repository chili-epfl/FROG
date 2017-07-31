// @flow

export default {
  name: 'Chat',
  type: 'react-component',
  shortDesc: 'Chat component',
  description: 'Persistent text chat',

  dataTypes: {
    incoming: [{ msg: 'string', user: 'string', id: 'Id' }],
    outgoing: [{ msg: 'string', user: 'string', id: 'Id' }]
  },

  exampleData: [
    {
      title: 'Empty chat',
      config: { title: 'Example chat' },
      data: []
    },
    {
      title: 'Chat with some messages',
      config: { title: 'Example chat' },
      data: [
        { id: '1', msg: 'This is the first message', user: 'Ole' },
        {
          id: '2',
          msg: "I don't agree, but we can discuss it",
          user: 'Petter'
        },
        {
          id: '3',
          msg: 'Let us do an experiment to test our hypothesis',
          user: 'Alfons'
        }
      ]
    }
  ]
};
