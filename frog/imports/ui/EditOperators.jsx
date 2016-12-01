import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data'
import Form from 'react-jsonschema-form'

import { operator_types, operator_types_obj } from '../operator_types';
import { Activities, addOperator, Operators } from '../api/activities'
import { keyBy, map } from 'lodash'


export const OperatorList = ( { operators, setFn } ) => { 
  return(
    <div>
      <h3>Operator list</h3>
      <ul> { 
        operators.map((operator) => { return(
          <li style={{listStyle: 'none'}} key={operator._id}>
            <a href='#' onClick={ () => Operators.remove({_id: operator._id}) }>
              <i className="fa fa-times" />
            </a>
            <a href='#' onClick={ () => setFn(operator.operator_type, operator) } >
              <i className="fa fa-pencil" />
            </a>
            {operator_types_obj[operator.operator_type].meta.name}
            <pre>{JSON.stringify(operator.data, null, 2)}</pre>
          </li>
          )
        }
        ) 
      } 
    </ul>
  </div>
  )
}

const OperatorFormComponent = (props) => {
  
  const schema = operator_types_obj[props.form].config
  const existing_id = props.existing ? props.existing._id : null 

  return (
    <Form 
      schema={schema} 
      onSubmit={(data) => props.submit(props.form, data.formData, existing_id)}
      formData={props.existing ? props.existing.data : {}}
    /> 
  )
}


export const OperatorForm = createContainer(() => {
  return {
    activities: Activities.find({status:'OUT'}).fetch(),
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
          {operator_type.meta.name} <i>({operator_type.meta.type})</i>
        </li>
      )
    } </ul>
</div>
)}
