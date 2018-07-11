// @flow
import importAll from 'import-all.macro';
import { entries } from 'frog-utils';

const operatorsRaw = importAll.sync(
  '../node_modules/op-*/src/operatorRunner?(.js)'
);

console.log(operatorsRaw);

export default entries(operatorsRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);
