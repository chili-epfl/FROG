// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      title: 'Title',
      type: 'string'
    },
    info: {
      type: 'string',
      title: 'Information for your students:'
    },
    userMediaConstraints: {
      type: 'object',
      title: 'Web camera and microphone',
      properties: {
        audio: {
          title: 'Use microphone',
          type: 'boolean',
          default: true
        },
        video: {
          title: 'Use web camera',
          type: 'boolean',
          default: true
        }
      }
    },
    activityType: {
      type: 'string',
      title:
        'Type of activity (many2many - group call, one2many - teacher to all)',
      enum: ['many2many', 'one2many'],
      default: 'many2many'
    }
  }
};

export const configUI = {
  activityType: {
    'ui:widget': 'radio'
  }
};
