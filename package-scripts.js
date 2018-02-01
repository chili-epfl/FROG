const { sync } = require('find-up');

const dir = sync('.git');

const fromRoot = cmd =>
  `cd ${dir}/../ && PATH=${dir}/../node_modules/.bin:$PATH} ${cmd}`;

const build = shouldWatch => {
  const cwd = process.cwd();
  return `babel ./src --out-dir ./dist ${shouldWatch ? '--watch' : ''} &`
};

const watch = build(true);

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
    watchAll
  },
  options: {
    silent: true
  }
};
