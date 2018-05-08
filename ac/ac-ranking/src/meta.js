// @flow

const trainConfig = {
  title: 'Which interface is the best?',
  guidelines:
    '<p>Please drag the items in order.</p><p><img src="/file?name=ac/ac-ranking/form.png" style={{padding: "5" }} width="306" height="146"/><img src="/file?name=ac/ac-ranking/graphical.png" border="2" width="306" height="112"/><img src="/file?name=ac/ac-ranking/dragndrop.png" border="2" width="300" height="262"/><img src="/file?name=ac/ac-ranking/command.png" border="2" width="302" height="98"/></p>',
  justify: true,
  mustJustify: true,
  answers: ['Form', 'Map', 'Command', 'Drag and Drop']
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
