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
    minVote: {
      title: 'Number of vote minimum to select an image (default: 1)',
      type: 'number'
    },
    canUpload: {
      title: 'Can students upload new images?',
      type: 'boolean'
    },
    canComment: {
      title: 'Should students comment on images?',
      type: 'boolean'
    },
    commentGuidelines: {
      title: 'Comment guidelines',
      type: 'string'
    },
    hideCategory: {
      title: 'Hide the categories',
      type: 'boolean'
    },
    images: {
      title: 'Images',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          url: {
            type: 'string',
            title: 'URL of the image'
          },
          categories: {
            type: 'array',
            title: 'Categories',
            items: {
              type: 'string'
            }
          }
        }
      }
    }
  }
};

export const configUI = {
  minVote: { conditional: 'canVote' }
};
