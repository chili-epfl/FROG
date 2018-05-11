// @flow

export const meta = {
  name: 'Common Knowledge board',
  shortName: 'CK Board',
  mode: 'collab',
  shortDesc: '2D board for placing items',
  description:
    'All imported items are placed on a 2D space. Optionally, teacher can designate four named quadrants. Students can drag boxes to organize or group ideas. Incoming items have title and content.',
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
    },
    {
      title: 'Background image',
      config: {
        quadrants: false,
        image: true,
        imageurl: '/file?name=ac/ac-ck-board/researchCycle.png'
      },
      data: [
        { title: 'Box 1', content: 'Contents of box 1' },
        { title: 'Box 2', content: 'Contents of box 2' }
      ]
    }
  ]
};

export const config = {
  type: 'object',
  properties: {
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
    },
    boxes: {
      title: 'Initial boxes',
      type: 'array',
      items: {
        type: 'object',
        title: 'Box',
        properties: {
          title: {
            type: 'string',
            title: 'Title'
          },
          content: {
            type: 'string',
            title: 'Content'
          }
        }
      }
    }
  }
};

export const configUI = {
  quadrant1: { conditional: 'quadrants' },
  quadrant2: { conditional: 'quadrants' },
  quadrant3: { conditional: 'quadrants' },
  quadrant4: { conditional: 'quadrants' },
  imageurl: { conditional: 'image' }
};

export const validateConfig = [
  (data: Object): null | { field?: string, err: string } =>
    data.image && data.quadrants
      ? {
          err:
            'You cannot have both a background image and quadrants at the same time'
        }
      : null
];
