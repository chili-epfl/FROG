
export const config = {
  type: 'object',
  properties: {
    title: {
      title: 'Title',
      type: 'string'
    },
    audio: {
      title: 'Connect with audio input',
      type: 'boolean',
      default: true
    },
    video:{
      title: 'Connect using camera',
      type: 'boolean',
      default: true
    }
  }
};