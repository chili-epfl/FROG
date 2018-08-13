// @flow
import { Meteor } from 'meteor/meteor';
import operators from './operatorRunners';
import { operatorTypesObj } from '../imports/operatorTypes';

declare var Promise: any;

const runOperatorFn = (oTID, data) => {
  const oT = operatorTypesObj[oTID];
  if (!oT || !oT.meta.preview) {
    throw new Meteor.Error('No operator or no preview');
  }
  const product = Promise.await(operators[oTID](data || {}));
  return product;
};

Meteor.methods({ 'run.operator': runOperatorFn });
