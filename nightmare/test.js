const Nightmare = require('nightmare');

const connect = name => {
  Nightmare({
    show: true,
    waitTimeout: 1000 // increase the default timeout to test things
  })
    .goto('http://localhost:3000/#/home/' + name)
    .wait(500)
    .goto('http://localhost:3000/#/teacher/' + name)
    .wait(500)
    .goto('http://localhost:3000/#/student/' + name)
    .wait(500)
    .goto('http://localhost:3000/#/graph/' + name)
    .wait(500)
    .goto('http://localhost:3000/#/admin/' + name)
    .wait(500)
    .then(result => console.log(result))
    .catch(error => console.error(error));
};

connect('username');