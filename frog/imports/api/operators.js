// @flow
import { Mongo } from 'meteor/mongo';
import { chainUpgrades, uuid } from 'frog-utils';

import { operatorTypesObj } from '/imports/operatorTypes';

export const Operators = new Mongo.Collection('operators');
export const ExternalOperators = new Mongo.Collection('external_operators');

export const insertOperatorToMongo = (operator: Object) => {  // make sure there is an operatorType
  try {
    const newOp = {
      ...operator,
      data: operatorTypesObj[operator.operatorType].upgradeFunctions
        ? chainUpgrades(
            operatorTypesObj[operator.operatorType].upgradeFunctions,
            operator.configVersion || 1,
            operatorTypesObj[operator.operatorType].configVersion
          )(operator.data)
        : operator.data,
      configVersion: operatorTypesObj[operator.operatorType].configVersion
    };
    Operators.insert(newOp);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e);
    // eslint-disable-next-line no-alert
    window.alert(
      'Format  error: unable to upgrade the configuration of the operator: ' +
        operator.title
    );
  }
};

export const findOperatorsMongo = (query: Object, proj: Object) =>
  Operators.find(query, proj).fetch().map(x =>
    x.operatorType && operatorTypesObj[x.operatorType].upgradeFunctions ? ({
      ...x,
      data: chainUpgrades(
            operatorTypesObj[x.operatorType].upgradeFunctions,
            x.configVersion || 1,
            operatorTypesObj[x.operatorType].configVersion
          )(x.data),
      configVersion: operatorTypesObj[x.operatorType].configVersion
    }) : x)

export const findOneOperatorMongo = (id: string) => {
  const operator = Operators.find(id)
  return operator.operatorType && operatorTypesObj[operator.operatorType].upgradeFunctions ? ({
    ...operator,
    data: chainUpgrades(
          operatorTypesObj[operator.operatorType].upgradeFunctions,
          operator.configVersion || 1,
          operatorTypesObj[operator.operatorType].configVersion
        )(operator.data),
    configVersion: operatorTypesObj[operator.operatorType].configVersion
  }) : operator
}


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
