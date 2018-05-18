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
        },
        videoResolution: {
          title: 'Video resolution',
          type: 'string',
          enum: [
            '1280x720',
            '800x600',
            '640x480',
            '640x360',
            '352x288',
            '320x240',
            '176x144',
            '160x120'
          ],
          default: '320x240'
        },
        frameRate: {
          title: 'Frames per second',
          type: 'number',
          default: 15
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

export const validateConfig = [
  (data: Object): null | { field?: string, err: string } =>
    !data.userMediaConstraints.frameRate ||
    data.userMediaConstraints.frameRate <= 0
      ? {
          field: 'frameRate',
          err: 'Frames per second must be positive number'
        }
      : null
];

export const configUI = {
  activityType: {
    'ui:widget': 'radio'
  }
};
