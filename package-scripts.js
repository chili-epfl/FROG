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

const build = x => {
  const bin = 'node_modules/.bin';
  const pkgdir = x || dirname(sync('package.json'));
  return `${dir}/${bin}/babel ${pkgdir}/src --out-dir ${pkgdir}/dist && ${dir}/${bin}/flow-copy-source ${pkgdir}/src ${pkgdir}/dist`;
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

const buildAll = background =>
  acop()
    .map(x => build(x))
    .join(background ? ' &&' : '&');

module.exports = {
  scripts: {
    setup: {
      default: fromRoot('git clean -fdx; ./initial_setup.sh'),
      clean: fromRoot('killall -9 node; git clean -fdx; ./initial_setup.sh')
    },
    server: fromRoot('cd frog && meteor'),
    build: {
      default: build(),
      all: buildAll(),
      ci: buildAll(true)
    },
    watch: fromRoot('node watch.js watch'),
    test: fromRoot('nps flow.quiet eslint jest'),
    eslint: {
      default: fromRoot('eslint -c .eslintrc-prettier.js --ext .js,.jsx .'),
      fix: fromRoot('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .')
    },
    flow: {
      default: fromRoot('flow'),
      quiet: fromRoot('flow --quiet')
    },
    jest: {
      default: fromRoot('jest'),
      watch: fromRoot('jest --watch')
    }
  },
  options: {
    silent: true
  }
};
