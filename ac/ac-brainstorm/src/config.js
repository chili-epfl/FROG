// @flow

export const config = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      title: 'Guidelines'
    },
    sort: {
      title: 'Sort items continuously according to votes',
      type: 'boolean',
      default: true
    },
    allowCreate: {
      title: 'Enable adding new Learning Items',
      type: 'boolean',
      default: true
    },
    specificLI: {
      title: 'Display specific Learning Item type',
      type: 'boolean',
      default: true
    },
    liType: {
      title: 'Learning Item type',
      type: 'learningItemType',
      default: 'li-idea'
    },
    allowGeneralLI: {
      title: 'Allow adding any Learning Item',
      type: 'boolean',
      default: true
    },
    allowEdit: {
      type: 'boolean',
      title: 'Allow editing Learning Items in the list'
    },
    allowDelete: {
      type: 'boolean',
      title: 'Allow deleting Learning Items in the list'
    },
    allowZoom: {
      type: 'boolean',
      title: 'Allow zooming Learning Items in the list',
      default: true
    },
    expandItems: { type: 'boolean', title: 'View items expanded' },
    allowVoting: { type: 'boolean', title: 'Allow voting', default: true }
  }
};

export const configUI = {
  specificLI: { conditional: 'allowCreate' },
  allowZoom: { conditional: (formData: Object) => !formData.expandItems },
  liType: {
    conditional: (formData: Object) =>
      formData.allowCreate && formData.specificLI
  },
  allowGeneralLI: {
    conditional: (formData: Object) => formData.allowCreate
  }
};
