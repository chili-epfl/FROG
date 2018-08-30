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
          enum: ['1280x720', '640x480', '352x288', '320x240'],
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
        'Type of activity (in group, everyone participats, in webinar, only admins (and invited users)',
      enum: ['group', 'webinar'],
      default: 'group'
    },
    recordChat: {
      type: 'boolean',
      title: 'Record video chat',
      default: false
    },
    muteParticipantsByDefault: {
      type: 'boolean',
      title: 'Mute participants by default',
      default: false
    },
    useAnalysis: {
      type: 'boolean',
      title: 'Use analysis',
      default: true
    },
    teacherNames: {
      type: 'string',
      title: 'Comma-separated list of user names of admins'
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
  },
  teacherNames: {
    conditional: (formData: any) => formData.activityType === 'webinar'
  }
};
