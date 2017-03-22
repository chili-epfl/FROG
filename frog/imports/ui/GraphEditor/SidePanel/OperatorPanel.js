// @flow
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';

const ChooseOperatorType = ({ operator }) => {
  const select = e => {
    if (operatorTypesObj[e]) {
      Operators.update(operator._id, { $set: { operatorType: e } });
    }
  };

  return (
    <DropdownButton
      title="Select operator type"
      id="selectOperator"
      onSelect={select}
    >
      {operatorTypes.map(x => (
        <MenuItem key={x.id} eventKey={x.id}>{x.meta.name}</MenuItem>
      ))}
    </DropdownButton>
  );
};

const EditOperator = ({ operator }) => (
  <Form
    schema={operatorTypesObj[operator.operatorType].config}
    onChange={data =>
      addOperator(operator.operatorType, data.formData, operator._id)}
    formData={operator.data}
    liveValidate
  >
    <div />
  </Form>
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
