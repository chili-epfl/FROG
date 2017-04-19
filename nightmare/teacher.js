const Nightmare = require('nightmare')

const nightmare = Nightmare({ show: true, x: 0, y: 0, width: 715, height: 430 })

// teacher

nightmare
  .goto('http://localhost:3000/#')
  .wait('a')
  .wait(100)
  .evaluate(() => window.switchUser('teacher'))
  .wait('button')
  .wait(100)
  .evaluate(() => window.restartSession())
  .wait('#sessionList')
  .wait(500)
  .click('button')
  .wait(10000)
  .click('button')
  .wait(10000)
  .end()
  .then(function(result) {
    console.log(result)
  })
  .catch(function(error) {
    console.error('Error:', error)
  })
