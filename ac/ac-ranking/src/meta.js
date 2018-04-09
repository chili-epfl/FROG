// @flow

const trainConfig = {
  title: 'Which interface is the best',
  guidelines: 'Please drag the items in order.',
  justify: true,
  answers: [
    { choice: 'Command' },
    { choice: 'Drag and Drop' },
    { choice: 'Graphical' },
    { choice: 'Form' }
  ]
};

export default {
  name: 'Ranking Activity',
  shortDesc: 'Prompt that allows the student to rank a set of answers.',
  description:
    'Students are able to provide a set of rankings for a given prompt.',
  exampleData: [
    {
      title: 'Train Interface',
      data: {},
      config: trainConfig
    }
  ]
};
