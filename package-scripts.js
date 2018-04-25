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
  return `${dir}/${bin}/babel ${x}/src --out-dir ${x}/dist && ${dir}/${bin}/flow-copy-source ${x}/src ${x}/dist`;
};
// const build = (shouldWatch, dirtowatch) => {
//   const pkgdir = dirtowatch || dirname(sync('package.json'));
//   return `${dir}/node_modules/.bin/babel ${pkgdir}/src --out-dir ${pkgdir}/dist ${
//     shouldWatch ? '--watch' : ''
//   } && ${dir}/node_modules/.bin/flow-copy-source ${pkgdir}/src ${pkgdir}/dist`;
// };

const acop = () => {
  const ac = readdirSync(dir + '/ac');
  const op = readdirSync(dir + '/op');
  return [
    ...ac.map(x => dir + '/ac/' + x),
    ...op.map(x => dir + '/op/' + x),
    dir + '/frog-utils'
  ];
};

const buildAll = () =>
  acop()
    .map(x => build(x))
    .join(' & ');

module.exports = {
  scripts: {
    setup: {
      default: fromRoot('git clean -fdx; ./initial_setup.sh'),
      clean: fromRoot('killall -9 node; git clean -fdx; ./initial_setup.sh')
    },
    server: fromRoot('cd frog && meteor'),
    build: {
      all: buildAll(),
      watch: {
        all: 'nps build.all watch.all'
      }
    },
    babel: fromRoot('babel --help'),
    watch: {
      all: fromRoot('node watch.js watch all')
    }
  },
  options: {
    silent: true
  }
};
