// @flow

export default {
  type: 'object',
  required: ['title', 'imgTrue', 'imgFalse'],
  properties: {
    title: {
      type: 'string',
      title: 'Title'
    },
    trueDef: {
      title: 'True definitions :',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    falseDef: {
      title: 'False definitions :',
      type: 'array',
      items: {
        type: 'string'
      }
    },
    imgTrue: {
      title: 'Correct image URL',
      type: 'string'
    },
    imgFalse: {
      title: 'Incorrect image URL',
      type: 'string'
    }
  }
};
