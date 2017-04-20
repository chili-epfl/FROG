const Nightmare = require('nightmare');
const script = require('./script');

const onlyUser = process.argv[2];

// const taxi = ['Stian', 'Peter', 'Nils'];
// const consumer = ['Ahmed', 'Peter', 'Ragnar'];
// const policy = ['Khanittra', 'Jean', 'Alphons'];
const windows = [
  [0, 0, 'teacher'],
  [0, 450, 'Stian'],
  [800, 0, 'Peter'],
  [800, 450, 'Ahmed']
];

let users;
if (onlyUser) {
  if (onlyUser === 'all') {
    users = windows;
  } else if (onlyUser === 'students') {
    users = windows.filter(x => x[2] !== 'teacher');
  } else {
    users = [windows.find(x => x[2] === onlyUser)];
    if (!users) {
      console.log('No such user pre-programmed!');
      process.exit(1);
    }
  }
} else {
  users = windows;
}

const nightmares = users.map(ary => [
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

const speedUp = process.argv[3] || 100;

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
      } else if (what === 'brainstorm') {
        x.insert('#root_title', param[0]);
        x.wait(10 * speedUp);
        x.insert('#root_content', param[1]);
        x.wait(10 * speedUp);
        x.click('#addButton');
      } else if (what === 'brainstormSubmit') {
        x.click('#saveButton');
      }
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
