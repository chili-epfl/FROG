module.exports = {
  scripts: {
    test:
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest',
    dockerTest:
      'rm -rf ./tmp/ && mkdir -p ./tmp/frog && git clone . ./tmp/frog && cd ./tmp/frog && docker build -t frogtest . && docker run frogtest',
    fix: 'eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .',
    eslintTest: 'eslint -c .eslintrc-prettier.js --ext .js,.jsx .',
    jest: 'jest',
    jestWatch: 'jest --watch',
    flowTest: 'flow',
    nightmareTest: 'node nightmare/test.js'
  },
  options: {
    silent: true
  }
};
