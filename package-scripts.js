var findParentDir = require('find-parent-dir');
 
const inContext = (exec) => { 
findParentDir(__dirname, '.git', (err, dir)=> {
process.chdir(dir)
return exec
}

module.exports = {
  scripts: {
    test:
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest',
    dockerTest:
      'rm -rf ./tmp/ && mkdir -p ./tmp/frog && git clone . ./tmp/frog && cd ./tmp/frog && docker build -t frogtest . && docker run frogtest',
    fix: inContext('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .'),
    eslintTest: 'eslint -c .eslintrc-prettier.js --ext .js,.jsx .',
    jest: 'jest',
    jestWatch: 'jest --watch',
    flowTest: 'flow'
  },
  options: {
    silent: true
  }
};
