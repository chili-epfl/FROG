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
    watch:
      'babel src --presets babel-preset-react,babel-preset-stage-0,babel-preset-es2015 --plugins babel-plugin-transform-class-properties,syntax-flow --out-dir dist -- watch && flow-copy-source --watch src dist',
    test: inContext(
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest'
    ),
    fix: inContext('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .'),
    eslintTest: inContext('eslint -c .eslintrc-prettier.js --ext .js,.jsx .'),
    jest: inContext('jest'),
    jestWatch: inContext('jest --watch'),
    flowTest: inContext('flow')
  },
  options: {
    silent: true
  }
};
