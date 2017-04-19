const Nightmare = require('nightmare');

const nightmare = Nightmare({
  show: true,
  x: 0,
  y: 0,
  width: 715,
  height: 430
});

// teacher

nightmare.goto('http://localhost:3000/#');
nightmare.wait('a');
nightmare.wait(500);
nightmare.evaluate(() => window.switchUser('teacher'));
nightmare.wait('button');
nightmare.wait(100);
nightmare.evaluate(() => window.restartSession());
nightmare.wait('#sessionList');
nightmare.wait(500);
nightmare.click('button');
nightmare.wait(10000);
nightmare.click('button');
nightmare.wait(10000);
nightmare
  .end()
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.error('Error:', error);
  });
