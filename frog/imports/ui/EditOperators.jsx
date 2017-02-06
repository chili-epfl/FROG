import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Form from 'react-jsonschema-form';

import { operatorTypes, operatorTypesObj } from '../operatorTypes';
import { Activities, Operators } from '../api/activities';

export const OperatorList = ({ operators, setFn }) => (
  <div>
    <h3>Operator list</h3>
    <ul>
      {operators.map(operator => (
        <li style={{ listStyle: 'none' }} key={operator._id}>
          <a href="#" onClick={() => Operators.remove({ _id: operator._id })}>
            <i className="fa fa-times" />
          </a>
          <a href="#" onClick={() => setFn(operator.operator_type, operator)}>
            <i className="fa fa-pencil" />
          </a>
          {operatorTypesObj[operator.operatorType].meta.name}
          <pre>{JSON.stringify(operator.data, null, 2)}</pre>
        </li>
      ))}
    </ul>
  </div>
);

const OperatorFormComponent = props => {
  const schema = operatorTypesObj[props.form].config;
  const existingId = props.existing ? props.existing._id : null;
  return (
    <Form
      schema={schema}
      onSubmit={data => props.submit(props.form, data.formData, existingId)}
      formData={props.existing ? props.existing.data : {}}
    />
  );
};

export const OperatorForm = createContainer(
  () => ({
    activities: Activities.find({ graphId: null, sessionId: null }).fetch()
  }),
  OperatorFormComponent
);

export const OperatorTypeList = ({ setFn }) => (
  <div>
    <h3>Add Operator</h3>
    <ul>
      {operatorTypes.map(operatorType => (
        <li key={operatorType.id} style={{ listStyle: 'none' }}>
          <a href="#" onClick={() => setFn(operatorType.id)}>
            <i className="fa fa-plus" />
          </a>
          {operatorType.meta.name} <i>({operatorType.meta.type})</i>
        </li>
      ))}
    </ul>
  </div>
);
