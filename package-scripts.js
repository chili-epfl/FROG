const { sync } = require('find-up');
const { dirname, join } = require('path');
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

const watch = all => {
  const pattern = all
    ? 'ac/*/src/** op/*/src/** frog-utils/src/**'
    : join(dirname(sync('package.json')), '/src/');

  const command = `if [ "{event}" = "change" ]; 
                   then src={path}; 
                   dist=$\{src/src/dist};
                   finaldist=$\{dist/jsx/js};
                   ${dir}/node_modules/.bin/babel $src  --out-file $finaldist; 
                   fi;`;

  return `${dir}/node_modules/.bin/chokidar ${pattern} -c '${command}'`;
};

const build = (shouldWatch, dirtowatch) => {
  const pkgdir = dirtowatch || dirname(sync('package.json'));
  return `${dir}/node_modules/.bin/babel ${pkgdir}/src --out-dir ${pkgdir}/dist ${
    shouldWatch ? '--watch' : ''
  }`;
};

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
    watch: watch(false),
    watchAll: watch(true),
    buildAll: buildAll(false),
    buildAllSingle: buildAll(false, true)
  },
  options: {
    silent: true
  }
};
