const findParentDir = require('find-parent-dir');
const { exec } = require('child_process');
import { sync as findUpSync } from 'find-up';

function getEnv(dir) {
  const env = clone(process.env);
  const alterPath = managePath(dir);
  const npmBin = findUpSync('node_modules/.bin');
  if (npmBin) {
    alterPath.unshift(npmBin);
  }
  return env;
}

const inContext = cmd => {
  const env = getEnv(dir);
  process.chdir(dir);
  findParentDir(__dirname, '.git', (err, dir) => {
    exec(cmd, { cwd: dir });
  });
};

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
