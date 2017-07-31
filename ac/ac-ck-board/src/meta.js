// @flow

export default {
  name: 'Common Knowledge board',
  type: 'react-component',
  mode: 'collab',
  shortDesc: '2D board for placing items',
  description:
    'All imported items are placed on a 2D space. Optionally, teacher can designate four named quadrants. Students can drag boxes to organize or group ideas. Incoming items have title and content.',

  types: {
    incoming: [{ _id: 'Id', title: 'string', content: 'string' }],
    outgoing: [
      {
        id: 'Id',
        title: 'string',
        content: 'string',
        x: 'xCoordinate',
        y: 'yCoordinate'
      }
    ]
  },

  exampleData: [
    {
      title: 'Board with two boxes',
      config: { quadrants: false },
      data: [
        { title: 'Box 1', content: 'Contents of box 1' },
        { title: 'Box 2', content: 'Contents of box 2' }
      ]
    },
    {
      title: 'Quadrants and boxes',
      config: {
        quadrants: true,
        quadrant1: 'Capitalism',
        quadrant2: 'Socialism',
        quadrant3: 'Modernism',
        quadrant4: 'Post-modernism'
      },
      data: [
        { title: 'Van Gogh', content: 'Painter' },
        { title: 'Marx', content: 'Thinker' },
        { title: 'Gramsci', content: 'Italian thinker' },
        { title: 'Friedman', content: 'Economist' }
      ]
    }
  ]
};
