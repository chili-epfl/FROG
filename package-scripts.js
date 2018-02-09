const { sync } = require('find-up');
const { dirname } = require('path');
const { readdirSync } = require('fs');

let dir;
const findDir = sync('.git');
if (findDir) {
  dir = dirname(findDir);
} else {
  // for Docker CI
  dir = '/usr/src/frog';
}

const fromRoot = cmd =>
  `cd ${dir}/ && PATH=${dir}/node_modules/.bin:$PATH} ${cmd}`;

const build = (shouldWatch, dirtowatch) => {
  const pkgdir = dirtowatch || dirname(sync('package.json'));
  return `${dir}/node_modules/.bin/babel ${pkgdir}/src --out-dir ${pkgdir}/dist ${
    shouldWatch ? '--watch' : ''
  }`;
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

const buildAll = (shouldWatch, notBackground) =>
  acop()
    .map(x => build(shouldWatch, x))
    .join(notBackground ? ' && ' : ' & ');

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
    buildAll: buildAll(false),
    buildAllSingle: buildAll(false, true)
  },
  options: {
    silent: true
  }
};
