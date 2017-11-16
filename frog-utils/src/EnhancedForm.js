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

export const calculateSchema = (
  formData: Object = {},
  schema: Object,
  UISchema: Object,
  oldHides?: string[] = [],
  oldSchema?: Object
): [Object, string[]] => {
  const hide = calculateHides(formData, schema, UISchema);
  if (!isEqual(hide, oldHides)) {
    const newSchema = cloneDeep(schema);
    hide.forEach(x => deleteFromSchema(newSchema, x));
    return [newSchema, hide];
  } else {
    return [oldSchema || schema, oldHides];
  }
};

class EnhancedForm extends Component {
  state: { formData?: ?Object, schema?: Object };
  hides: string[];
  formData: ?Object;

  componentWillMount() {
    if (!this.props.formData && jsonSchemaDefaults(this.props.schema) !== {}) {
      this.updateSchema({
        ...this.props,
        formData: jsonSchemaDefaults(this.props.schema)
      });
    } else {
      this.updateSchema(this.props);
      this.formData = this.props.formData;
      this.setState({ formData: this.props.formData });
    }
  }

  componentDidUpdate = (prevProps: Object) => {
    if (
      !isEqual(this.props.schema, prevProps.schema) ||
      !isEqual(this.props.uiSchema, prevProps.uiSchema)
    ) {
      this.hides = [];
      this.formData = this.props.formData;
      this.setState({ formData: this.props.formData });
      this.updateSchema(this.props, true);
    }
  };

  onChange = (e: { formData: Object }) => {
    this.formData = e.formData;
    if (this.props.onChange) {
      this.props.onChange(e);
    }
    this.updateSchema(this.props);
  };

  updateSchema = (props: Object, newSchema: boolean = false) => {
    const [schema, hides] = calculateSchema(
      this.formData || this.props.formData,
      props.schema,
      props.uiSchema,
      this.hides || [],
      (this.state && !newSchema && this.state.schema) || this.props.schema
    );
    this.hides = hides;
    if (
      JSON.stringify((this.state && this.state.schema) || {}) !==
      JSON.stringify(schema)
    ) {
      this.setState({
        schema,
        formData: this.formData
      });
    }
  };

  render() {
    return (
      this.state.schema && (
        <Form
          {...this.props}
          onChange={this.onChange}
          schema={this.state.schema}
          formData={this.state.formData}
        />
      )
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
