// @flow
import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { ChangeableText } from 'frog-utils';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';
import { connect } from '../store';

const ChooseOperatorType = ({ operator }) => {
  const select = e => {
    if (operatorTypesObj[e]) {
      Operators.update(operator._id, { $set: { operatorType: e } });
    }
  };

  return (
    <div>
      <h3>Please select operator type</h3>
      <DropdownButton id="selectOperator" onSelect={select} title="Select">
        {operatorTypes.map(x =>
          <MenuItem key={x.id} eventKey={x.id}>{x.meta.name}</MenuItem>
        )}
      </DropdownButton>
    </div>
  );
};

const EditClass = ({ store: { operatorStore: { all } }, operator }) => {
  const graphOperator = all.find(act => act.id === operator._id);

  return (
    <div>
      <div style={{ backgroundColor: '#eee' }}>
        <h3>
          <ChangeableText
            value={graphOperator.title || ''}
            operatorId={operator._id}
            onChange={graphOperator.rename}
          />
        </h3>
        <font size={-3}>
          <i>
            {`Type: ${operatorTypesObj[operator.operatorType].meta.name}
                     (${operator.operatorType})`}
          </i>
        </font>
        <hr />
      </div>
      <Form
        schema={operatorTypesObj[operator.operatorType].config}
        onChange={data =>
          addOperator(operator.operatorType, data.formData, operator._id)}
        formData={operator.data}
        liveValidate
      >
        <div />
      </Form>
    </div>
  );
};

const EditOperator = connect(EditClass);

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
