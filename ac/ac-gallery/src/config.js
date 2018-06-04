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
    onlyImages: {
      type: 'boolean',
      title: 'Limit to images?'
    },
    canComment: {
      title: 'Should students comment on Learning Items?',
      type: 'boolean'
    },
    commentGuidelines: {
      title: 'Comment guidelines',
      type: 'string'
    },
    hideCategory: {
      title: 'Hide the categories',
      type: 'boolean'
    }
  }
};

export const configUI = {
  minVote: { conditional: 'canVote' },
  onlyImages: { conditional: 'canUpload' }
};
