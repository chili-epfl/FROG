// @flow
import React, { Component } from 'react';
import Form from 'react-jsonschema-form';
import { cloneDeep, isEqual } from 'lodash';
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

const deleteFromSchemaRecursive = (schema, toDeleteList) => {
  if (toDeleteList.length < 1 || !schema) return;

  // if type array or object, we go one step deeper in the schema
  // to find the property to delete
  if (schema.type === 'array') {
    deleteFromSchemaRecursive(schema.items, toDeleteList);
  }
  if (schema.type === 'object') {
    deleteFromSchemaRecursive(schema.properties, toDeleteList);
  }

  // if we are at the end of the list we delete the element, otherwise
  // we make a step in the schema
  if (toDeleteList.length === 1) {
    delete schema[toDeleteList[0]];
  } else {
    const newSchema = schema[toDeleteList[0]];
    toDeleteList.shift();
    deleteFromSchemaRecursive(newSchema, toDeleteList);
  }
};

const deleteFromSchema = (schema, x) => {
  const toDeleteList = x.split('.');
  deleteFromSchemaRecursive(schema, toDeleteList);
};

const calculateSchema = (
  formData: Object = {},
  schema: Object,
  UISchema: Object
): Object => {
  const hide = calculateHides(formData, schema, UISchema);
  const newSchema = cloneDeep(schema);
  hide.forEach(x => deleteFromSchema(newSchema, x));
  return newSchema;
};

class EnhancedForm extends Component {
  state: { schema?: Object };

  componentWillMount() {
    if (!this.props.formData && jsonSchemaDefaults(this.props.schema) !== {}) {
      this.updateSchema({
        ...this.props,
        formData: jsonSchemaDefaults(this.props.schema)
      });
    } else {
      this.updateSchema(this.props);
    }
  }

  componentWillReceiveProps(nextProps: Object) {
    if (!isEqual(this.props, nextProps)) {
      this.setState({ schema: undefined });
      this.updateSchema(nextProps);
    }
  }

  updateSchema(props: Object) {
    this.setState({
      schema: calculateSchema(props.formData, props.schema, props.uiSchema)
    });
  }
  render() {
    return (
      this.state.schema && <Form {...this.props} schema={this.state.schema} />
    );
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
