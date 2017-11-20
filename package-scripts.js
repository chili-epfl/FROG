const { sync } = require('find-up');

const dir = sync('.git');
const babel = watch =>
  `babel src --presets babel-preset-react,babel-preset-stage-0,babel-preset-es2015 --plugins babel-plugin-transform-class-properties,syntax-flow --out-dir dist ${
    watch ? '--watch ' : ''
  }&  flow-copy-source ${watch ? '--watch ' : ''}src dist &`;
const watch = babel(true);
const build = babel(false);

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
