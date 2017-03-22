// @flow
import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';
import { DropdownButton, MenuItem } from 'react-bootstrap';

import { Operators, addOperator } from '/imports/api/activities';
import { operatorTypes, operatorTypesObj } from '/imports/operatorTypes';
import { connect, type StoreProp } from '../store';
import TextInput from '../utils/TextInput';

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
        {operatorTypes.map(x => (
          <MenuItem key={x.id} eventKey={x.id}>{x.meta.name}</MenuItem>
        ))}
      </DropdownButton>
    </div>
  );
};

export const RenameField = connect(({
  store: { operatorStore: { all } },
  operatorId,
  onSubmit
}: StoreProp & {
  operatorId: string,
  onSubmit: string
}) => {
  const renameOpen = all.find(opt => opt.id === operatorId);
  return (
    <TextInput
      value={renameOpen.title}
      onChange={renameOpen.rename}
      onCancel={onSubmit}
      onSubmit={onSubmit}
    />
  );
});

class EditClass extends Component {
  state: { editTitle: boolean };

  constructor(props) {
    super(props);
    this.state = { editTitle: false };
  }

  render() {
    const operator = this.props.operator;
    const graphOperator = this.props.store.operatorStore.all.find(
      act => act.id === operator._id
    );

    return (
      <div>
        <div style={{ backgroundColor: '#eee' }}>
          {this.state.editTitle
            ? <h3>
                <RenameField
                  operatorId={operator._id}
                  onSubmit={() => {
                    this.setState({ editTitle: false });
                  }}
                />
              </h3>
            : <h3>
                <a href="#" onClick={() => this.setState({ editTitle: true })}>
                  <i className="fa fa-pencil" />
                </a>
                &nbsp;{graphOperator.title || 'Unnamed Operator'}
              </h3>}
          <font size={-3}>
            <i>
              {
                `Type: ${operatorTypesObj[operator.operatorType].meta.name}
                     (${operator.operatorType})`
              }
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
  }
}

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
