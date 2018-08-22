// @flow

import importAll from 'import-all.macro';
import { type operatorPackageT, entries, values } from 'frog-utils';

const packagesRaw = importAll.sync('../node_modules/op-*/src/index.js');
export const operatorTypesObj = entries(packagesRaw).reduce(
  (acc, [k, v]) => ({ ...acc, [k.split('/')[2]]: v.default }),
  {}
);

export const operatorTypes: operatorPackageT[] = values(operatorTypesObj);
