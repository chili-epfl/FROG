// @flow

export default {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      title: 'Guidelines'
    },
    formBoolean: {
      type: 'boolean',
      title: 'Should students submit new ideas?'
    },
    roles: {
      type: 'socialAttribute',
      title:
        'Social attribute to determine editing rights (only role "editor" can edit)'
    }
  }
};
