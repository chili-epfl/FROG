const { sync } = require('find-up');

const dir = sync('.git');
const watch = `${dir}/../node_modules/.bin/babel src --out-dir dist --watch`;
const build = `${dir}/../node_modules/.bin/babel src --out-dir dist`;

const watchAll = `
cd ${dir}/..
for dir in ./ac/ac-*/ ./op/op-*/
do
    cd $dir
    echo Beginning to watch $dir
    ${watch}
    cd ../..
done

cd ./frog-utils
${watch}
`;

const fromRoot = cmd =>
  `cd ${dir}/../ && PATH=${dir}/../node_modules/.bin:$PATH} ${cmd}`;

module.exports = {
  scripts: {
    build,
    eslintTest: fromRoot('eslint -c .eslintrc-prettier.js --ext .js,.jsx .'),
    fix: fromRoot('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .'),
    flowTest: fromRoot('flow'),
    jest: fromRoot('jest'),
    jestWatch: fromRoot('jest --watch'),
    test: fromRoot(
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest'
    ),
    watch,
    watchAll
  },
  options: {
    silent: true
  }
};
