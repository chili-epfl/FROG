const Nightmare = require('nightmare')

const windows = [
  [0, 0, 'teacher'],
  [0, 450, 'alfred'],
  [800, 0, 'ole'],
  [800, 450, 'chen li']
]

const nightmares = windows.map(ary => [
  Nightmare({ show: true, x: ary[0], y: ary[1], height: 430, width: 710 }),
  ary[2]
])

const script = [
  ['teacher', 'wait', '#sessionList'],
  ['teacher', 'nextActivity'],
  ['students', 'wait', '#ac-iframe'],
  ['students', 'wait', 2000],

  ['alfred', 'chat', 'Hello'],
  ['all', 'wait', 3000],
  ['ole', 'chat', 'Howdy'],
  ['all', 'wait', 2500],
  ['chen li', 'chat', 'Nihao'],

  ['students', 'wait', '#ac-brainstorm'],
  ['teacher', 'wait', 3000],
  ['teacher', 'nextActivity'],

  ['students', 'wait', 1500],
  ['chen li', 'chat', 'What are we supposed to do now?'],
  ['alfred', 'type', ['title', 'Something']],
  ['chen li', 'type', ['content', 'Something else']],
  ['all', 'wait', '#neverending']
]

nightmares.forEach(([x, user]) => {
  x.goto('http://localhost:3000/')
  x.wait('a')
  x.wait(3000)
  x.evaluate(u => window.switchUser(u), user)
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

  x
    .end()
    .then(function(result) {
      console.log(result)
    })
    .catch(function(error) {
      console.error('Error:', error)
    })
})
