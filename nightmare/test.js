const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: true,
  x: 800,
  width: 710,
  y: 0,
  height: 430
})

// peter

nightmare
  .goto('http://localhost:3000/#')
  .wait(3000)
  .evaluate(() => window.switchUser('peter'))
  .wait('#ac-iframe')
  .insert('input#chatinput', '')
  .type('input#chatinput', 'how about that\u000d')
  .wait(500)
  .insert('input#chatinput', '')
  .type('input#chatinput', 'yeah sure\u000d')
  .click('button')
  .wait('#ac-brainstorm')
  .end()
  .then(function(result) {
    console.log(result)
  })
  .catch(function(error) {
    console.error('Error:', error)
  })
