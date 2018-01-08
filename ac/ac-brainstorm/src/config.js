// @flow

export const config = {
  type: 'object',
  required: ['text'],
  properties: {
    text: {
      type: 'string',
      title: 'Guidelines'
    },
    formBoolean: {
      type: 'boolean',
      title: 'Should students submit new ideas?',
      default: true
    }
  }
};
