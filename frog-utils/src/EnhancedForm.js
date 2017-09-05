// @flow
import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import { cloneDeep } from 'lodash';
import jsonSchemaDefaults from 'json-schema-defaults';

export const calculateHides = (
  formData: Object = {},
  schema: Object,
  UISchema: Object
): string[] => {
  const hide = [];
  if (UISchema) {
    Object.keys(UISchema).forEach(x => {
      const cond = UISchema[x].conditional;
      if (cond) {
        if (typeof cond === 'string') {
          if (!formData[cond]) {
            hide.push(x);
          }
        } else {
          try {
            if (!cond(formData)) {
              hide.push(x);
            }
          } catch (e) {
            hide.push(x);
          }
        }
      }
    });
  }
  return hide;
};

const calculateSchema = (
  formData: Object = {},
  schema: Object,
  UISchema: Object
): Object => {
  const hide = calculateHides(formData, schema, UISchema);
  const newSchema = cloneDeep(schema);
  hide.forEach(x => delete newSchema.properties[x]);
  return newSchema;
};

class EnhancedForm extends Component {
  componentWillMount() {
    if (!this.props.formData && jsonSchemaDefaults(this.props.schema) !== {}) {
      window.setTimeout(
        this.props.onChange({
          formData: jsonSchemaDefaults(this.props.schema)
        }),
        0
      );
    }
  }
  render() {
    const schema = calculateSchema(
      this.props.formData,
      this.props.schema,
      this.props.uiSchema
    );

    return <Form {...this.props} schema={schema} />;
  }
}

export default EnhancedForm;

export const hideConditional = (
  formData: Object = {},
  schema: Object,
  UISchema: Object
): Object => {
  if (UISchema) {
    const hides = calculateHides(formData, schema, UISchema);

    const newFormData = cloneDeep(formData);
    hides.forEach(hide => delete newFormData[hide]);
    return newFormData;
  } else {
    return formData;
  }
};
