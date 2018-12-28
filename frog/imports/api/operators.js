// @flow
import { Mongo } from 'meteor/mongo';
import { chainUpgrades, uuid } from 'frog-utils';

import { operatorTypesObj } from 'imports/operatorTypes';

export const Operators = new Mongo.Collection('operators');
export const ExternalOperators = new Mongo.Collection('external_operators');

const extractUpgradedOperatorConfig = (operator: Object) => ({
  ...operator,
  data: operatorTypesObj[operator.operatorType].upgradeFunctions
    ? chainUpgrades(
        operatorTypesObj[operator.operatorType].upgradeFunctions,
        operator.configVersion || 1,
        operatorTypesObj[operator.operatorType].configVersion
      )(operator.data)
    : operator.data,
  configVersion: operatorTypesObj[operator.operatorType].configVersion
});

export const insertOperatorMongo = (operator: Object) => {
  // make sure there is an operatorType
  try {
    Operators.insert(
      operator.operatorType ? extractUpgradedOperatorConfig(operator) : operator
    );
  } catch (e) {
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert(
      'Format  error: unable to upgrade the configuration of the operator: ' +
        operator.title
    );
  }
};

export const findOperatorsMongo = (query: Object, proj?: Object) =>
  Operators.find(query, proj)
    .fetch()
    .map(
      x =>
        x.operatorType && operatorTypesObj[x.operatorType]
          ? extractUpgradedOperatorConfig(x)
          : x
    );

export const findOneOperatorMongo = (id: string) => {
  const operator = Operators.find(id);
  return operator.operatorType &&
    operatorTypesObj[operator.operatorType] &&
    operatorTypesObj[operator.operatorType].upgradeFunctions
    ? extractUpgradedOperatorConfig(operator)
    : operator;
};

export const addOperator = (
  operatorType: string,
  data: Object = {},
  id: ?string
) => {
  if (id) {
    Operators.update(id, { $set: { data } });
  } else {
    Operators.insert({
      _id: uuid(),
      operatorType,
      type: operatorTypesObj[operatorType].type,
      data,
      createdAt: new Date()
    });
  }
};

export const removeOperatorType = (id: string) => {
  Operators.update(id, {
    $unset: { operatorType: null, data: null, configVersion: null }
  });
};
