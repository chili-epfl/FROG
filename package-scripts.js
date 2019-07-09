const { dirname } = require('path');
const { sync } = require('find-up');

const help = `echo '
       FROG scripts:

        test - run all tests
      eslint - run ESLint
  eslint.fix - run ESLint --fix, will format with Prettier
        flow - run Flow
  flow.quiet - run Flow --quiet
        jest - run Jest
  jest.watch - run Jest in watch mode
      server - run server (can be run from any directory)
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

module.exports = {
  scripts: {
    unlink: fromRoot(
      'rm -rf frog/node_modules',
      'Unlinked, you can run Yarn commands now'
    ),
    link: fromRoot(
      'rm -rf frog/node_modules; ln -s `pwd`/node_modules frog',
      'Relinked, you can run Meteor now'
    ),
    cleanCache: fromRoot(
      'rm -rf ./frog/.meteor/local/build ./frog/.meteor/local/bundler-cache ./frog/.meteor/local/plugin-cache; node linkFiles.js'
    ),
    yarn: fromRoot(
      'rm -rf frog/node_modules; yarn; rm -rf frog/node_modules; ln -s `pwd`/node_modules frog',
      'Unlinked, ran yarn, and relinked, all set to go'
    ),
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
    server: fromRoot(
      'QUALIA_ONE_BUNDLE_TYPE=modern NODE_OPTIONS="--max_old_space_size=8192" cd frog && meteor',
      'Starting Meteor'
    ),
    test: {
      default: fromRoot(
        `nps -s flow.quiet eslint jest`,
        'Running Flow, ESLint and Jest'
      ),
      ci: fromRoot(
        `nps -s eslint cypress.ci`,
        'Running LockFiles, Flow, ESLint and Jest - jest and flow temporarily disabled'
      )
    },
    eslint: {
      default: fromRoot(
        'fastlint --working-copy --print0 origin/develop --glob "**/*.{js,jsx}" | xargs -0 eslint --cache -c .eslintrc-prettier.js --ext ".js,.jsx"',
        'Running ESLint'
      ),
      fix: fromRoot(
        'fastlint --working-copy --print0 origin/develop --glob "**/*.{js,jsx}" | xargs -0 eslint --fix --cache -c .eslintrc-prettier.js --ext ".js,.jsx"',
        'Running ESLint in Fix mode'
      ),
      normal: fromRoot(
        'eslint --cache -c .eslintrc-prettier.js --ext ".js,.jsx" .',
        'Running ESLint in normal mode'
      ),
      normalfix: fromRoot(
        'eslint --fix --cache -c .eslintrc-prettier.js --ext ".js,.jsx" .',
        'Running ESLint in normal fix mode'
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
    cypress: {
      default: fromRoot('cypress open', 'Starting Cypress'),
      run: fromRoot('cypress run', 'Starting Cypress in headless mode'),
      ci: fromRoot(
        'start-server-and-test "yarn start server" http://localhost:3000 "yarn start cypress.run"',
        'Starting Cypress in CI mode. Cypress will start once the server is running.'
      )
    },
    lockfiles: fromRoot(
      'cmp --silent yarn.lock yarn.lock.orig || (echo Error: yarn.lock is modified after a fresh install; exit 1)'
    ),
    help
  },
  options: {
    silent: true
  }
};
