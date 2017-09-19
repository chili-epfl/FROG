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
    },
    socialEdit: {
      type: 'boolean',
      title: 'Only students with role: editor can edit/add'
    },
    roles: {
      type: 'socialAttribute',
      title: 'Social attribute to get role: editor'
    }
  }
};

export const configUI = {
  socialEdit: { conditional: 'formBoolean' },
  roles: { conditional: 'socialEdit' }
};
