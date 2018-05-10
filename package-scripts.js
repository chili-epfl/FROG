const { sync } = require('find-up');
const { dirname } = require('path');
const { readdirSync } = require('fs');

const help = `echo '
       FROG scripts:

       watch - watch and rebuild all files outside of frog/frog
        test - run all tests
      eslint - run ESLint
  eslint.fix - run ESLint --fix, will format with Prettier
        flow - run Flow
  flow.quiet - run Flow --quiet
        jest - run Jest
  jest.watch - run Jest in watch mode
       setup - run initial setup
 setup.clean - clean all files (will delete files not added to Git) and run setup
      server - run server (can be run from any directory)
       build - build current directory
   build.all - build all directories
     '
`;

let dir;
const findDir = sync('.git');
if (findDir) {
  dir = dirname(findDir);
} else {
  // for Docker CI
  dir = '/usr/src/frog';
}

const fromRoot = (cmd, msg) =>
  `echo ${msg ||
    ''} & cd ${dir}/ && PATH=${dir}/node_modules/.bin:$PATH ${cmd}`;

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
      default: fromRoot(
        'git clean -fdx; ./initial_setup.sh',
        'Cleaning all files and running initial setup'
      ),
      clean: fromRoot(
        'killall -9 node; git clean -fdx; ./initial_setup.sh',
        'Killing Node, cleaning all files and running initial setup'
      )
    },
    server: fromRoot('cd frog && meteor', 'Starting Meteor'),
    build: {
      default: build(),
      all: buildAll(),
      ci: buildAll(true)
    },
    watch: fromRoot(`node watch.js watch`, 'Watching and transpiling files'),
    test: fromRoot(
      `nps -s flow.quiet eslint jest`,
      'Running Flow, ESLint and Jest'
    ),
    eslint: {
      default: fromRoot(
        'eslint -c .eslintrc-prettier.js --ext .js,.jsx .',
        'Running ESLint'
      ),
      fix: fromRoot(
        'eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .',
        'Running ESLint in Fix mode'
      )
    },
    flow: {
      default: fromRoot('flow', 'Running Flow'),
      quiet: fromRoot('flow --quiet', 'Running Flow quietly')
    },
    jest: {
      default: fromRoot('jest', 'Starting Jest'),
      watch: fromRoot('jest --watch', 'Starting Jest in watch mode')
    },
    help
  },
  options: {
    silent: true
  }
};
