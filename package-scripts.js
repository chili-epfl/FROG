const { exec } = require('child_process');
const { sync } = require('find-up');
const managePath = require('manage-path');

function getEnv() {
  const env = { ...process.env };
  const alterPath = managePath(env);
  const npmBin = sync('node_modules/.bin');
  if (npmBin) {
    alterPath.unshift(npmBin);
  }
  return env;
}

const inContext = cmd => {
  const dir = sync('.git');
  process.chdir(dir + '/..');
  const child = exec(cmd, {
    env: getEnv()
  });

  child.on('error', error => {
    console.error(error);
  });
  return '';
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
