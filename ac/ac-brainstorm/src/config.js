// @flow

export const config = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      title: 'Guidelines'
    },
    formBoolean: {
      type: 'boolean',
      title: 'Should students submit new ideas?',
      default: true
    },
    zoomShowsHistory: {
      type: 'boolean',
      title: 'Show history slider when user zooms in'
    }
  }
};
