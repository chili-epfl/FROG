const Nightmare = require('nightmare');

const apps = ['home', 'admin', 'graph', 'teacher', 'student']

const N = Nightmare({
  show: true,
  waitTimeout: 5000 // increase the default timeout to test things
})
  
apps.forEach(app => {
  N.goto('http://localhost:3000/#/' + app + '/anyuser')
  N.wait('#' + app)
})

N.end()
N.then()
