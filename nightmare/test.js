const Nightmare = require('nightmare');
const nightmare = Nightmare({
  show: true,
  x: 800,
  width: 710,
  y: 0,
  height: 430
});

// peter

nightmare
  .goto('http://localhost:3000/graph/peter')
  .wait('a')
  .wait(500)
  .evaluate(() => window.switchUser('peter'))
  .wait('#ac-iframe')
  .insert('input#chatinput', '')
  .type('input#chatinput', 'how about that\u000d')
  .wait(500)
  .insert('input#chatinput', '')
  .type('input#chatinput', 'yeah sure\u000d')
  .wait('#ac-brainstorm')
  .end()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
