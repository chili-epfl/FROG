export const config = {
  type: 'object',
  properties: {
    guidelines: {
      title: 'Guidelines',
      type: 'string'
    },
    canVote: {
      title: 'Can students vote ?',
      type: 'boolean'
    },
    canUpload: {
      title: 'Can students add new Learning Items',
      type: 'boolean'
    },
    allowAny: {
      title: 'Can students add any Learning Item type?',
      type: 'boolean'
    },
    provideDefault: {
      title: 'Offer default Learning Item type',
      type: 'boolean'
    },
    liType: {
      title: 'Default Learning Item Type',
      type: 'learningItemType'
    },
    canComment: {
      title: 'Should students comment on Learning Items?',
      type: 'boolean'
    },
    bigZoom: {
      title: 'Zoom the Learning Item 2x in the modal view',
      type: 'boolean'
    },
    canSearch: {
      title: 'Enable filtering/searching Learning Items',
      type: 'boolean'
    },
    canBookmark: {
      title:
        'Enable bookmarking (starring) items, and toggle to view only starred items',
      type: 'boolean'
    },
    commentGuidelines: {
      title: 'Comment guidelines',
      type: 'string'
    },
    expand: { title: 'Expand Learning Items', type: 'boolean' },
    hideCategory: {
      title: 'Hide the categories',
      type: 'boolean'
    }
  }
};

export const configUI = {
  provideDefault: { conditional: 'canUpload' },
  liType: { conditional: 'provideDefault' },
  allowAny: { conditional: 'canUpload' },
  commentGuidelines: { conditional: 'canComment' }
};
