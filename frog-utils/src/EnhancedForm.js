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
