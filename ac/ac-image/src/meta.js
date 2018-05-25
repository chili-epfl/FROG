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

export const meta = {
  name: 'Gallery',
  type: 'react-component',
  shortDesc: 'Display learning items',
  description:
    'Display a list of learning items, possibly categorised, option to allow upload and voting',
  exampleData: [
    {
      title: 'Simple view',
      learningItems,
      config: {
        minVote: 1
      },
      data: {
        a1: { id: 'a1', li: '1' },
        a2: { id: 'a2', li: '2' },
        a3: { id: 'a3', li: '3' },
        a4: { id: 'a4', li: '4' }
      }
    },
    {
      title: 'With categories',
      config: {
        guidelines: 'Look at categories of image'
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1', categories: ['tree', 'house'] },
        a2: { id: 'a2', li: '2', category: 'tree' },
        a3: { id: 'a3', li: '3', category: 'house' },
        a4: { id: 'a4', li: '4', categories: ['sky', 'tree'] }
      }
    },
    {
      title: 'With votes',
      config: {
        guidelines: 'Votez pour les images les plus interessantes',
        canVote: true,
        minVote: 2
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1', categories: ['tree', 'house'] },
        a2: { id: 'a2', li: '2', category: 'tree' },
        a3: { id: 'a3', li: '3', category: 'house' },
        a4: { id: 'a4', li: '4', categories: ['sky', 'tree'] }
      }
    }
  ]
};
