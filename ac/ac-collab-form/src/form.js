import React, { Component } from 'react';
import Form from 'react-jsonschema-form';

class CollabForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {}
    };
  }

  propdef = this.props.config.questions
    .split(',')
    .reduce(
      (acc, x, i) => ({ ...acc, [i + '']: { type: 'string', title: x } }),
      {}
    );

  formdef = {
    title: this.props.config.title,
    type: 'object',
    properties: this.propdef
  };

  onChange = x => {
    this.setState({ formData: x.formData });
    this.props.logger({ form: x.formData });
    this.props.reactiveFn.keySet('formData', x.formData);
  };

  render() {
    return (
      <Form
        schema={this.formdef}
        formData={
          this.props.reactiveData.key && this.props.reactiveData.key.formData ||
            {}
        }
        onSubmit={x => this.props.onCompletion(x.formData)}
        onChange={this.onChange}
      />
    );
  }
}

export default CollabForm;
