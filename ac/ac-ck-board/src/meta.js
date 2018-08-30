// @flow

const learningItems = [
  {
    id: '1',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2',
    liType: 'li-idea',
    payload: { title: 'Uber', content: 'AirBnB for taxis' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '3',
    liType: 'li-idea',
    payload: { title: 'Amazon Alexa', content: 'AskJeeves for speech' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4',
    liType: 'li-image',
    payload: {
      url: 'https://i.imgur.com/pfZAxeTb.jpg',
      thumburl: 'https://i.imgur.com/pfZAxeTb.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  }
];

const data = {
  '1': { id: '1', li: '1' },
  '2': { id: '2', li: '2' },
  '3': { id: '3', li: '3' },
  '4': { id: '4', li: '4' }
};

export const meta = {
  name: 'Common Knowledge board',
  mode: 'collab',
  shortDesc: '2D board for placing items',
  description:
    'All imported items are placed on a 2D space. Optionally, teacher can designate four named quadrants. Students can drag boxes to organize or group ideas. Incoming items have title and content.',
  exampleData: [
    {
      title: 'Board',
      config: { quadrants: false },
      data,
      learningItems
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
      data,
      learningItems
    },
    {
      title: 'Background image',
      config: {
        quadrants: false,
        image: true,
        imageurl: '/clientFiles/ac-ck-board/researchCycle.png'
      },
      data,
      learningItems
    }
  ]
};

export const config = {
  type: 'object',
  properties: {
    allowCreate: { title: 'Enable adding new Learning Items', type: 'boolean' },
    image: {
      title: 'Display background image',
      type: 'boolean'
    },
    imageurl: {
      title: 'URL of background image',
      type: 'string'
    },
    quadrants: {
      title: 'Draw four quadrants, named as below',
      type: 'boolean'
    },
    quadrant1: {
      title: 'Quadrant 1 title',
      type: 'string'
    },
    quadrant2: {
      title: 'Quadrant 2 title',
      type: 'string'
    },
    quadrant3: {
      title: 'Quadrant 3 title',
      type: 'string'
    },
    quadrant4: {
      title: 'Quadrant 4 title',
      type: 'string'
    }
  }
};

export const configUI = {
  quadrant1: { conditional: 'quadrants' },
  quadrant2: { conditional: 'quadrants' },
  quadrant3: { conditional: 'quadrants' },
  quadrant4: { conditional: 'quadrants' },
  imageurl: { conditional: 'image' },
  image: { conditional: (formData: Object) => !formData.quadrants },
  quadrants: { conditional: (formData: Object) => !formData.image }
};
