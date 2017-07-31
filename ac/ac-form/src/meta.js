// @flow

export default {
  name: 'Simple form',
  type: 'react-component',
  shortDesc: 'Form with text fields',
  description:
    'Creates a form with specified text fields, optionally allow students to submit multiple forms.',

  types: { incoming: undefined, outgoing: {} },

  exampleData: [
    {
      title: 'Sample form',
      config: {
        questions:
          'What is the capital or Iraq?,How many people live in the Niger delta?',
        multiple: false
      },
      activityData: {}
    },
    {
      title: 'Allow multiple submissions',
      config: {
        questions: 'How can we improve the environment?',
        multiple: true
      },
      activityData: {}
    }
  ]
};
