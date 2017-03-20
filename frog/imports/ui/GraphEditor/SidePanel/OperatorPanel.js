// @flow
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import Dropdown from 'react-dropdown';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';

const ChooseOperatorType = ({ operator }) => {
  const options = operatorTypes.map(x => ({ value: x.id, label: x.meta.name }));
  const onChange = e => {
    if (operatorTypesObj[e.value]) {
      Operators.update(operator._id, { $set: { operatorType: e.value } });
    }
  };

  return <Dropdown options={options} onChange={onChange} />;
};

const EditOperator = ({ operator }) => (
  <Form
    schema={operatorTypesObj[operator.operatorType].config}
    onSubmit={data =>
      addOperator(operator.operatorType, data.formData, operator._id)}
    formData={operator.data}
    liveValidate
  />
);

export default createContainer(
  ({ id }) => ({ operator: Operators.findOne(id) }),
  ({ operator }) => {
    if (operator.operatorType && operator.operatorType !== '') {
      return <EditOperator operator={operator} />;
    } else {
      return <ChooseOperatorType operator={operator} />;
    }
  }
);
