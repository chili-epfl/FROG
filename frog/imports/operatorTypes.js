// @flow

import importAll from 'import-all.macro';
import { type operatorPackageT, entries, values } from '/imports/frog-utils';

const packagesRaw = importAll.sync('../node_modules/op-*/src/index.js');
const packagesRawInternal = importAll.sync('./internalOperators/op-*/index.js');

const operatorsExt = entries(packagesRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);

export const operatorTypesObj = entries(packagesRawInternal).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  operatorsExt
);

export const operatorTypes: operatorPackageT[] = values(operatorTypesObj);
