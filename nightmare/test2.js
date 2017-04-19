const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: true,
  y: 450,
  height: 430,
  x: 0,
  width: 710
})

// alfred

nightmare
  .goto('http://localhost:3000/#')
  .wait(3000)
  .evaluate(() => window.switchUser('alfred'))
  .wait('#ac-iframe')
  .wait(500)
  .insert('input#chatinput', '')
  .type('input#chatinput', 'are you sure?\u000d')
  .wait(500)
  .insert('input#chatinput', '')
  .type('input#chatinput', 'if you say so...\u000d')
  .click('button')
  .wait('#ac-brainstorm')
  .end()
  .then(function(result) {
    console.log(result)
  })
  .catch(function(error) {
    console.error('Error:', error)
  })

// .insert('input#root_0', '')
// .type('input#root_0', 'I disagree!\u000d')
