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
    studentCannotGoFurther: {
      title: 'Student cannot go further than teacher',
      default: false,
      type: 'boolean'
    },
    studentMustFollow: {
      title: 'Students must follow teacher',
      default: false,
      type: 'boolean'
    },
    everyoneCanEdit: {
      title: 'Everyone can edit',
      default: false,
      type: 'boolean'
    }
  }
};
