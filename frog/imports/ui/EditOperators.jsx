import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'

import { operator_types, operator_types_obj } from '../operator_types';
import { Activities, addOperator, Operators } from '../api/activities'
import { keyBy, map } from 'lodash'


export const OperatorList = ( { operators, activities, setFn } ) => { 
  return(
    <div>
      <h3>Operator list</h3>
      <ul> { 
        operators.map((operator) => {
          const act_map = keyBy(activities, x => x._id)
          return(

          <li style={{listStyle: 'none'}} key={operator._id}>
            <a href='#' onClick={ () => Operators.remove({_id: operator._id}) }>
              <i className="fa fa-times" />
            </a>
            &nbsp;
            <a href='#' onClick={ () => setFn(operator.operator_type, operator) } >
              <i className="fa fa-pencil" />
            </a>
            &nbsp;
            {act_map[operator.data.from].data.name} 
            <b>-></b> 
            <span className='text-success'>[{operator.operator_type}]</span> <b>-></b> 
            {act_map[operator.data.to].data.name}
          </li>
          )
        }
        ) 
      } 
    </ul>
  </div>
  )
}


function validate(formData, errors) {
  if (formData.from == formData.to) {
    errors.from.addError("Source and target nodes cannot be identical");
  }
  return errors;
}

const OperatorFormComponent = (props) => {
  const schema_orig = operator_types_obj[props.form].config

  const from = {
    from: {
      type: "string",
      title: 'Source node (activity)',
      enum: map(props.activities, (k, v) => k._id),
      enumNames: props.activities.map(k => k.data.name)
    }
  }

  const to = {
    to: {
      type: "string",
      title: 'Target node (activity)',
      enum: map(props.activities, (k, v) => k._id),
      enumNames: props.activities.map(k => k.data.name)
    }
  }

  const schema = {...schema_orig, properties: { ...schema_orig.properties, ...from, ...to }}
  const existing_id = props.existing ? props.existing._id : null 

  return (
    <Form 
      schema={schema} 
      onSubmit={(data) => props.submit(props.form, data.formData, existing_id)}
      formData={props.existing ? props.existing.data : {}}
      validate={validate}/> 
  )
}


export const OperatorForm = createContainer(() => {
  return {
    activities: Activities.find({}).fetch(),
  }
}, OperatorFormComponent)


export const OperatorTypeList = ({ setFn }) => { return(
  <div>
    <h3>Add Operator</h3>
    <ul> { 
      operator_types.map((operator_type) => 
        <li key={operator_type.id} style={{listStyle: 'none'}} >
          <a href='#' onClick={() => setFn(operator_type.id)}>
            <i className="fa fa-plus"></i>&nbsp;
          </a>
          {operator_type.meta.name}
        </li>
      )
    } </ul>
</div>
)}
