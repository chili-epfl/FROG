// @flow

const trainConfig = {
  title: 'Which interface is the best?',
  guidelines:
    '<p>Please drag the items in order.</p><p><img src="file?name=ac/ac-ranking/trainactivity.png" style={{padding: "5" }} width="306" height="146"/><img src="/file?name=cjg7q4md100073i6impu8qvo4" border="2" width="306" height="112"/><img src="/file?name=cjg7q50t600083i6i0spm9jdi" border="2" width="300" height="262"/><img src="/file?name=cjg7q58xy00093i6icte72u16" border="2" width="302" height="98"/></p>',
  justify: true,
  mustJustify: true,
  answers: ['Form', 'Graphical', 'Command', 'Drag and Drop']
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
