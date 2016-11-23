import React, { Component } from 'react';
import JsonschemaForm from "react-jsonschema-form";
import { booleanize } from 'frog-utils'
import { default as config } from './config'

export const meta = {
  name: 'Simple form',
  type: 'react-component'
}

const modifyForm = (questions, title) => {
  const propdef = questions.split(',').reduce(
    (acc, x, i) => ({...acc, [i + '']: { type: 'string', title: x}}),
    {} )

  const formdef = { 
    title: title,
    type: 'object',
    properties: propdef
  } 

  return formdef
}

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      existing: []
    }

    this.formDef = modifyForm(this.props.config.questions, this.props.config.title)
  }

  onChange = (x) => {
    this.setState({formData: x.formData})
    this.props.logger({form: x.formData})
  }

  onSubmitFn = (x) => {
    if(booleanize(this.props.config.multiple)) {
      const existing = [...this.state.existing, this.state.formData]
      this.props.onCompletion(existing)
    } else {
      this.props.onCompletion(x.formData)
    }
  }

  onAddAnother = () => {
    this.setState({
      existing: [...this.state.existing, this.state.formData],
      formData: {}
    })
  }

  render() { return (
    <div>
      <JsonschemaForm schema={this.formDef} formData={this.state.formData} onSubmit={this.onSubmitFn} onChange={this.onChange} />

      { booleanize(this.props.config.multiple) ? 
          <button className='btn btn-primary btn-sm' onClick={this.onAddAnother}>Save and add another</button> : 
          null
      }
    </div>
  )}
}

const ActivityRunner = (props) => 
  <Form {...props} />

  export default { id: 'ac-form', meta: meta, config: config, ActivityRunner: ActivityRunner }
