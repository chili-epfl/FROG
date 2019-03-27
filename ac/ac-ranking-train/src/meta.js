// @flow

const trainConfig = {
  title: 'Which interface is the best?',
  guidelines:
    '<p>Please drag the items in order.</p><p><img src="/clientFiles/ac-ranking/form.png" style={{padding: "5" }} width="306" height="146"/><img src="/clientFiles/ac-ranking/graphical.png" border="2" width="306" height="112"/><img src="/clientFiles/ac-ranking/dragndrop.png" border="2" width="300" height="262"/><img src="/clientFiles/ac-ranking/command.png" border="2" width="302" height="98"/></p>',
  justify: true,
  mustJustify: true,
  answers: ['Form', 'Map', 'Command', 'Drag and Drop'],
  rerank: true
};

export default {
  name: 'Ranking with Dashboard Data',
  shortDesc: 'Prompt that allows the student to rank a set of answers.',
  description:
    'Students are able to provide a set of rankings for a given prompt.',
  exampleData: [
    {
      title: 'Train Interface with data',
      config: { ...trainConfig, dashboard: true },
      data: {
        progress: 0,
        time: 398177,
        step: 5,
        score: 17,
        guidelines: true,
        iteration: 20,
        logs: {
          error: {
            dragdrop: [0, 0, 0, 0, 0],
            form: [0, 0, 0, 0, 0],
            map: [0, 0, 0, 0, 0],
            command: [0, 0, 1, 1, 1]
          },
          time: {
            dragdrop: [17.388, 24.097, 20.757, 24.755, 25.853],
            form: [19.45, 19.549, 16.697, 18.025, 20.922],
            map: [26.786, 22.626, 16.06, 20.403, 30.166],
            command: [40.07, 24.182, 1.38, 6.896, 2.115]
          },
          help: { command: 2 },
          count: {
            dragdrop: [1, 1, 1, 1, 1],
            form: [1, 1, 1, 1, 1],
            map: [1, 1, 1, 1, 1],
            command: [1, 1, 1, 1, 1]
          },
          sum: {
            error: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1],
            count: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            time: [
              17.388,
              24.097,
              20.757,
              24.755,
              25.853,
              19.45,
              19.549,
              16.697,
              18.025,
              20.922,
              26.786,
              22.626,
              16.06,
              20.403,
              30.166,
              40.07,
              24.182,
              1.38,
              6.896,
              2.115
            ]
          }
        }
      }
    },
    {
      title: 'Train Interface with prompt',
      config: trainConfig
    }
  ]
};
