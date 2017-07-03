// @flow

export default {
  type: 'object',
  properties: {
    goodDef: {
      title: 'What is the correct definition ?',
      type: 'string'
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
