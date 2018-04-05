// @flow


const existConfig = {
  title: 'Which interface is the best',
  guidelines: 'Please drag the items in order.',
  justify: false,
  shuffle: false,
  answers: [
    { choice: 'Command' },
    { choice: 'Drag and Drop' },
    { choice: 'Graphical' },
    { choice: 'Form' }
  ]
};

const trainConfig = {
  title: 'Which interface is the best',
  guidelines: 'Please drag the items in order.',
  justify: true,
  shuffle: false,
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
      title: 'Adding to Exisiting List',
      data: [
        { id: 'a', rank: 1, title: 'AirBnB' },
        { id: 'b', rank: 2, title: 'Uber' },
        { id: 'c', rank: 3, title: 'Amazon Alexa' }
      ],
      config: existConfig
    },
    {
      title: 'Train Interface',
      data: {},
      config: trainConfig
    }
  ]
};
