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
    answers: {
      type: 'array',
      title: 'Choices',
      items: { type: 'string' }
    }
  }
};
