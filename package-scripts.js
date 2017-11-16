const { sync } = require('find-up');

const dir = sync('.git');

const watchAll = `
echo 'hello'
cd ${dir}/..
for dir in ./ac/ac-*/ ./op/op-*/
do
    cd $dir
    echo 'Beginning to watch $dir'
    babel src --presets babel-preset-react,babel-preset-stage-0,babel-preset-es2015 --plugins babel-plugin-transform-class-properties,syntax-flow --out-dir dist --watch &  
    flow-copy-source --watch src dist &
    cd ../..
done

cd ./frog-utils
babel src --presets babel-preset-react,babel-preset-stage-0,babel-preset-es2015 --plugins babel-plugin-transform-class-properties,syntax-flow --out-dir dist --watch &  
flow-copy-source --watch src dist &
`;

const modify = cmd =>
  `cd ${dir}/../ && PATH=${dir}/../node_modules/.bin:$PATH} ${cmd}`;

module.exports = {
  scripts: {
    watchAll,
    watch:
      'babel src --presets babel-preset-react,babel-preset-stage-0,babel-preset-es2015 --plugins babel-plugin-transform-class-properties,syntax-flow --out-dir dist --watch &  flow-copy-source --watch src dist &',
    test: modify(
      'flow --quiet && npm run -s start eslint-test && npm run -s start jest'
    ),
    fix: modify('eslint --fix -c .eslintrc-prettier.js --ext .js,.jsx .'),
    eslintTest: modify('eslint -c .eslintrc-prettier.js --ext .js,.jsx .'),
    jest: modify('jest'),
    jestWatch: modify('jest --watch'),
    flowTest: modify('flow')
  },
  options: {
    silent: true
  }
};
