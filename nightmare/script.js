const Nightmare = require('nightmare');

// const taxi = ['Stian', 'Peter', 'Nils'];
// const consumer = ['Ahmed', 'Peter', 'Ragnar'];
// const policy = ['Khanittra', 'Jean', 'Alphons'];
const windows = [
  [0, 0, 'teacher'],
  [0, 450, 'Stian'],
  [800, 0, 'Peter'],
  [800, 450, 'Ahmed']
];

const nightmares = windows.map(ary => [
  Nightmare({
    show: true,
    x: ary[0],
    y: ary[1],
    height: 430,
    width: 710,
    waitTimeout: 99999999
  }),
  ary[2]
]);

const speedUp = 100;

const script = [
  ['teacher', 'waitSel', '#start'],
  ['teacher', 'wait', 10],
  ['students', 'waitSel', '#startSoon'],
  ['teacher', 'nextActivity'],
  ['students', 'waitSel', '#ac-iframe'],
  ['students', 'wait', 15],

  ['Peter', 'chat', 'So what are we supposed to do?'],
  ['all', 'wait', 30],
  [
    'Stian',
    'chat',
    'I think we need to discuss these issues, to prepare ourselves before the big group'
  ],
  ['all', 'wait', 25],
  ['Ahmed', 'chat', 'Is anyone else here?'],

  ['students', 'waitSel', '#ac-brainstorm'],
  ['teacher', 'wait', 120],
  ['teacher', 'nextActivity'],
  ['teacher', 'wait', 550],

  ['all', 'wait', 15],
  ['Peter', 'chat', 'So now we need to bring our perspectives together'],
  ['Ahmed', 'chat', "OK, now I'm alone?"],
  [
    'Stian',
    'brainstorm',
    [
      'Not vetting drivers',
      'Drivers have not been thoroughly vetted for criminal records etc'
    ]
  ],
  ['all', 'wait', 25],
  ['Peter', 'wait', 100],
  [
    'Peter',
    'brainstorm',
    [
      'Surge pricing is immoral',
      'Normal taxis are reliable and have to pick up everyone. Uber breaks those norms'
    ]
  ],
  ['Peter', 'brainstormSubmit'],
  ['Stian', 'brainstormSubmit'],
  ['students', 'waitSel', '#ac-ck-board'],
  ['teacher', 'nextActivity'],
  ['teacher', 'wait', 550],
  ['students', 'wait', 50]
];

nightmares.forEach(([x, user]) => {
  x.goto('http://localhost:3000/');
  x.wait('a');
  x.wait(3000);
  x.evaluate(u => window.switchUser(u), user);
  if (user === 'teacher') {
    x.evaluate(() => window.restartSession());
  }

  script.forEach(([who, what, param]) => {
    if (
      who === 'all' ||
      (who === 'students' && user !== 'teacher') ||
      who === user
    ) {
      if (what === 'wait') {
        x.wait(param * speedUp);
      } else if (what === 'waitSel') {
        x.wait(param);
      } else if (what === 'chat') {
        x.insert('input#chatinput', '');
        x.type('input#chatinput', param + '\u000d');
      } else if (what === 'nextActivity') {
        x.click('button');
      } else if (what === 'type') {
        x.type('#root_' + param[0], param[1]);
      }
    } else if (what === 'brainstorm') {
      x.insert('#root_title', param[0]);
      x.wait(10 * speedUp);
      x.insert('#root_content', param[1]);
      x.wait(10 * speedUp);
      x.click('#addButton');
    } else if (what === 'brainstormSubmit') {
      x.click('#saveButton');
    }
  });

  x
    .end()
    .then(result => {
      console.log(result);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});
