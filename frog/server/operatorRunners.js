// @flow
import importAll from 'import-all.macro';
import { entries } from 'frog-utils';

const operatorsRaw = importAll.sync(
  '../node_modules/op-*/src/operatorRunner?(.js)'
);

const operatorsRawInternal = importAll.sync(
  '../imports/internalOperators/*/operatorRunner?(.js)'
);
console.log(operatorsRawInternal);

const operatorsExt = entries(operatorsRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);

const operatorRunners = entries(operatorsRawInternal).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[3]]: v.default }),
  operatorsExt
);

console.log(operatorRunners);

export default operatorRunners;
