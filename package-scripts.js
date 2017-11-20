const { sync } = require('find-up');

const dir = sync('.git');
const watch =
  'babel src --presets babel-preset-react,babel-preset-stage-0,babel-preset-es2015 --plugins babel-plugin-transform-class-properties,syntax-flow --out-dir dist --watch &  flow-copy-source --watch src dist &';

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
    watch,
    watchAll,
    test: fromRoot(
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest'
    ),
    fix: fromRoot('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .'),
    eslintTest: fromRoot('eslint -c .eslintrc-prettier.js --ext .js,.jsx .'),
    jest: fromRoot('jest'),
    jestWatch: fromRoot('jest --watch'),
    flowTest: fromRoot('flow')
  },
  options: {
    silent: true
  }
};
