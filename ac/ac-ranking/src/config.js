// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      title: 'Prompt',
      type: 'string' // note that it will not autoload in preview with rte
    },
    guidelines: {
      title: 'Guidelines',
      type: 'string'
    },
    justify: {
      type: 'boolean',
      title: 'Students must provide a justification for their ranking'
    },
    shuffle: {
      type: 'boolean',
      title: 'Shuffle answer order for each student'
    },
    answers: {
      type: 'array',
      title: 'Choices',
      items: {
        type: 'object',
        properties: {
          choice: {
            type: 'string',
            title: 'choice'
          }
        }
      }
    }
  }
};
