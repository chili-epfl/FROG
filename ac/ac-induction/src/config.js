// @flow

export default {
  type: 'object',
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
      title: 'correct image uri',
      type: 'string'
    },
    imgFalse: {
      title: 'incorrect image uri',
      type: 'string'
    }
  }
};
