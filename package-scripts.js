module.exports = {
  scripts: {
    test: 'flow --quiet && npm run -s start eslint-test',
    dockerTest:
      'rm -rf ./tmp/ && mkdir -p ./tmp/frog && git clone . ./tmp/frog && cd ./tmp/frog && docker build -t frogtest . && docker run frogtest',
    fix: 'eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .',
    eslintTest: 'eslint -c .eslintrc-prettier.js --ext .js,.jsx .',
    jestWatch: 'jest --watch',
    jest: 'jest',
    flowTest: 'flow',
    nightmareTest: 'node nightmare/test.js'
  },
  options: {
    silent: true
  }
};
