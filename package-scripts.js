const { sync } = require('find-up');
const { dirname } = require('path');
const { readdirSync } = require('fs');

const dir = dirname(sync('.git'));

const fromRoot = cmd =>
  `cd ${dir}/ && PATH=${dir}/node_modules/.bin:$PATH} ${cmd}`;

const build = (shouldWatch, dirtowatch) => {
  const pkgdir = dirtowatch || dirname(sync('package.json'));
  return `${dir}/node_modules/.bin/babel ${pkgdir}/src --out-dir ${pkgdir}/dist ${
    shouldWatch ? '--watch' : ''
  } &`;
};

const watch = build(true);

const acop = () => {
  const ac = readdirSync(dir + '/ac');
  const op = readdirSync(dir + '/op');
  return [
    ...ac.map(x => dir + '/ac/' + x),
    ...op.map(x => dir + '/op/' + x),
    dir + '/frog-utils'
  ];
};

const buildAll = shouldWatch =>
  acop()
    .map(x => build(shouldWatch, x))
    .join('\n');

module.exports = {
  scripts: {
    build: build(false),
    eslintTest: fromRoot('eslint -c .eslintrc-prettier.js --ext .js,.jsx .'),
    fix: fromRoot('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .'),
    flowTest: fromRoot('flow'),
    jest: fromRoot('jest'),
    jestWatch: fromRoot('jest --watch'),
    test: fromRoot(
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest'
    ),
    watch,
    watchAll: buildAll(true),
    buildAll: buildAll(false)
  },
  options: {
    silent: true
  }
};
