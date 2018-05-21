// @flow

export const config = {
  type: 'object',
  properties: {
    title: {
      title: 'What is the title?',
      type: 'string'
    },
    pdf_url: {
      title: 'Full PDF URL',
      type: 'string'
    },
    debug: {
      title: 'Debugging',
      default: false,
      type: 'boolean'
    },
    studentMustFollow: {
      title: "Students must follow teacher",
      default: true,
      type: 'boolean'
    }
  }
};
