const { exec } = require('child_process');
const { spawn } = require('child_process');
const { sync } = require('find-up');

function getEnv(dir) {
  const env = { ...process.env };
  const alterPath = managePath(dir);
  const npmBin = sync('node_modules/.bin');
  if (npmBin) {
    alterPath.unshift(npmBin);
  }
  return env;
}

const inContext = cmd => {
  const dir = sync('.git');
  process.chdir(dir);
  const child = spawn(cmd, {
    stdio: 'inherit',
    env: getEnv(dir)
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
