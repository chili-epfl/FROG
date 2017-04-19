const Nightmare = require('nightmare');

const connect = name => {
  Nightmare({
    show: true,
    waitTimeout: 30000 // increase the default timeout to test things
  })
    .goto('http://localhost:3000/#/' + name)
    .wait(5000)
    .goto('http://localhost:3000/#/student')
    .then(result => console.log(result))
    .catch(error => console.error(error));
};

connect('nightmare1');
connect('nightmare2');
connect('nightmare3');
connect('nightmare4');
