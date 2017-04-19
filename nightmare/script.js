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
  [, 'wait', 500],
  ['alfred', 'chat', 'Hello'],
  [, 'wait', 500],
  ['ole', 'chat', 'Howdy']
]

nightmares.forEach(([x, user]) => {
  location = user === 'teacher' ? 'teacher' : 'student'
  x.goto('http://localhost:3000/' + user)
  x.wait('a')
  x.wait(500)
  x.evaluate(user => window.switchUser(user), user)
  x.wait('#ac-iframe')
  script.forEach(([who, what, param]) => {
    if (!who || who === user) {
      if (what === 'what') {
        x.what(param)
      } else if (what === 'chat') {
        x.insert('input#chatinput', '')
        x.type('input#chatinput', param + '\u000d')
      }
    }
  })
})

nightmares.forEach(([x, user]) => {
  x
    .end()
    .then(function(result) {
      console.log(result)
    })
    .catch(function(error) {
      console.error('Error:', error)
    })
})

// windowleft.wait('#ac-iframe')
// windowright.wait('#ac-iframe')
// windowleft.wait(500)
// windowright.wait(500)
// windowleft.insert('input#chatinput', '')
// windowright.insert('input#chatinput', '')
// windowleft.type('input#chatinput', 'are you sure?\u000d')
// windowright.type('input#chatinput', 'are you sure?\u000d')
// windowleft.wait(500)
// windowright.wait(500)
// windowleft.insert('input#chatinput', '')
// windowright.insert('input#chatinput', '')
// windowleft.type('input#chatinput', 'if you say so...\u000d')
// windowright.type('input#chatinput', 'if you say so...\u000d')
// windowleft.wait('#ac-brainstorm')
// windowright.wait('#ac-brainstorm')
// windowright
//   .end()
//   .then(function(result) {
//     console.log(result)
//   })
//   .catch(function(error) {
//     console.error('Error:', error)
//   })
// windowleft
//   .end()
//   .then(function(result) {
//     console.log(result)
//   })
//   .catch(function(error) {
//     console.error('Error:', error)
//   })

// // .insert('input#root_0', '')
// // .type('input#root_0', 'I disagree!\u000d')
