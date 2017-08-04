// @flow

export const config = {
  type: 'object',
  properties: {
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
  quadrant4: { conditional: 'quadrants' }
};
