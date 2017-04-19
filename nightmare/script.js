const Nightmare = require('nightmare')

const windows = [
  [0, 0, 'teacher'],
  [0, 450, 'alfred'],
  [800, 0, 'ole'],
  [800, 450, 'chen li']
]

const nightmares = windows.map(ary => [
  Nightmare({
    show: true,
    x: ary[0],
    y: ary[1],
    height: 430,
    width: 710,
    waitTimeout: 99999
  }),
  ary[2]
])

const speedUp = 50

const script = [
  ['teacher', 'waitSel', '#start'],
  ['teacher', 'wait', 10],
  ['teacher', 'nextActivity'],
  ['students', 'waitSel', '#ac-iframe'],
  ['students', 'wait', 20],

  ['alfred', 'chat', 'Hello'],
  ['all', 'wait', 30],
  ['ole', 'chat', 'Howdy'],
  ['all', 'wait', 25],
  ['chen li', 'chat', 'Nihao'],

  ['students', 'waitSel', '#ac-brainstorm'],
  ['teacher', 'wait', 30],
  ['teacher', 'nextActivity'],

  ['all', 'wait', 15],
  ['chen li', 'chat', 'What are we supposed to do now?'],
  ['ole', 'chat', 'Am I all alone?'],
  ['alfred', 'type', ['title', 'Something']],
  ['chen li', 'type', ['content', 'Something else']],
  ['ole', 'type', ['content', 'Madagascar!!! else']],
  ['teacher', 'wait', 30],
  ['students', 'wait', 5]
]

nightmares.forEach(([x, user]) => {
  x.goto('http://localhost:3000/')
  x.wait('a')
  x.wait(3000)
  x.evaluate(u => window.switchUser(u), user)
  ;[1, 2, 3].forEach(() => {
    if (user === 'teacher') {
      x.evaluate(() => window.restartSession())
    }

    script.forEach(([who, what, param]) => {
      if (
        who === 'all' ||
        (who === 'students' && user !== 'teacher') ||
        who === user
      ) {
        if (what === 'wait') {
          x.wait(param * speedUp)
        } else if (what === 'waitSel') {
          x.wait(param)
        } else if (what === 'chat') {
          x.insert('input#chatinput', '')
          x.type('input#chatinput', param + '\u000d')
        } else if (what === 'nextActivity') {
          x.click('button')
        } else if (what === 'type') {
          x.type('#root_' + param[0], param[1])
        }
      }
    })
  })

  x
    .end()
    .then(function(result) {
      console.log(result)
    })
    .catch(function(error) {
      console.error('Error:', error)
    })
})
