// const taxi = ['Stian', 'Peter', 'Nils'];
// const consumer = ['Ahmed', 'Peter', 'Ragnar'];
// const policy = ['Khanittra', 'Jean', 'Alphons'];
module.exports = [
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
